import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { subDays, addDays } from 'date-fns';
import useHybridPersistence from '../hooks/useHybridPersistence';

const AppContext = createContext();

const defaultStartDate = subDays(new Date(), 30).toISOString();
const defaultEndDate = addDays(new Date(), 60).toISOString();

export const AppProvider = ({ children, user }) => {
    const [userSettings, setUserSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [client, setClient] = useState(null);
    const [connectionError, setConnectionError] = useState(null);

    console.log('✅ Using cloud-first context for user:', user?.username || user?.email);

    // Cloud operations for hybrid persistence
    const tasksCloudOps = {
        load: async () => {
            if (!client) return null;
            const result = await client.models.Task.list();
            return result.data || [];
        },
        save: async (tasks) => {
            // Note: Individual task updates handled by CRUD operations
            return tasks;
        }
    };

    const milestonesCloudOps = {
        load: async () => {
            if (!client) return null;
            const result = await client.models.Milestone.list();
            return result.data || [];
        },
        save: async (milestones) => {
            // Note: Individual milestone updates handled by CRUD operations
            return milestones;
        }
    };

    const settingsCloudOps = {
        load: async () => {
            if (!client) return null;
            const result = await client.models.UserSettings.list();
            return result.data?.[0] || null;
        },
        save: async (settings) => {
            if (!client || !settings) return null;
            if (settings.id) {
                const result = await client.models.UserSettings.update(settings);
                return result.data;
            } else {
                const result = await client.models.UserSettings.create(settings);
                return result.data;
            }
        }
    };

    // Hybrid persistence hooks
    const { data: tasks, updateData: updateTasksData, syncStatus: tasksSyncStatus } = 
        useHybridPersistence('tasks', [], tasksCloudOps);
    
    const { data: milestones, updateData: updateMilestonesData, syncStatus: milestonesSyncStatus } = 
        useHybridPersistence('milestones', [], milestonesCloudOps);
    
    const { data: localSettings, updateData: updateSettingsData, syncStatus: settingsSyncStatus } = 
        useHybridPersistence('settings', { theme: 'light', semesterStart: defaultStartDate, semesterEnd: defaultEndDate }, settingsCloudOps);

    // Extract theme and dates from settings
    const theme = localSettings?.theme || 'light';
    const semesterStart = localSettings?.semesterStart || defaultStartDate;
    const semesterEnd = localSettings?.semesterEnd || defaultEndDate;

    // Initialize GraphQL client
    useEffect(() => {
        try {
            const graphqlClient = generateClient();
            setClient(graphqlClient);
            setConnectionError(null);
            console.log('✅ GraphQL client initialized');
        } catch (error) {
            console.error('❌ Failed to initialize GraphQL client:', error);
            setConnectionError(error.message);
            setIsLoading(false);
        }
    }, []);

    // Load user data when client and user are ready
    useEffect(() => {
        if (client && user) {
            setIsLoading(false); // Let hybrid persistence handle loading
            console.log('✅ Client ready, hybrid persistence will handle data loading');
        }
    }, [client, user]);

    // === MILESTONE FUNCTIONS ===
    const addMilestone = async (milestone) => {
        try {
            const newMilestone = {
                ...milestone,
                id: crypto.randomUUID(),
                completed: false,
                description: milestone.description || ''
            };

            // Update local state immediately
            const updatedMilestones = [...milestones, newMilestone];
            await updateMilestonesData(updatedMilestones);

            // Sync to cloud if available
            if (client) {
                try {
                    await client.models.Milestone.create(newMilestone);
                    console.log('✅ Milestone synced to cloud:', newMilestone.name);
                } catch (cloudError) {
                    console.warn('❌ Cloud sync failed for milestone:', cloudError);
                    // Local data is still saved
                }
            }
        } catch (error) {
            console.error('❌ Error adding milestone:', error);
        }
    };

    const removeMilestone = async (id) => {
        try {
            // Update local state immediately
            const updatedMilestones = milestones.filter(m => m.id !== id);
            await updateMilestonesData(updatedMilestones);

            // Sync to cloud if available
            if (client) {
                try {
                    await client.models.Milestone.delete({ id });
                    console.log('🗑️ Milestone deleted from cloud');
                } catch (cloudError) {
                    console.warn('❌ Cloud sync failed for milestone deletion:', cloudError);
                    // Local data is still updated
                }
            }
        } catch (error) {
            console.error('❌ Error removing milestone:', error);
        }
    };

    const toggleMilestoneCompletion = async (id) => {
        try {
            const milestone = milestones.find(m => m.id === id);
            const updatedMilestone = { ...milestone, completed: !milestone.completed };
            
            // Update local state immediately
            const updatedMilestones = milestones.map(m => m.id === id ? updatedMilestone : m);
            await updateMilestonesData(updatedMilestones);

            // Sync to cloud if available
            if (client) {
                try {
                    await client.models.Milestone.update({
                        id,
                        completed: !milestone.completed,
                    });
                    console.log('✅ Milestone toggled in cloud:', !milestone.completed);
                } catch (cloudError) {
                    console.warn('❌ Cloud sync failed for milestone toggle:', cloudError);
                    // Local data is still updated
                }
            }
        } catch (error) {
            console.error('❌ Error toggling milestone completion:', error);
        }
    };

    const updateMilestone = async (id, updatedData) => {
        try {
            const milestone = milestones.find(m => m.id === id);
            const updatedMilestone = { ...milestone, ...updatedData };
            
            // Update local state immediately
            const updatedMilestones = milestones.map(m => m.id === id ? updatedMilestone : m);
            await updateMilestonesData(updatedMilestones);

            // Sync to cloud if available
            if (client) {
                try {
                    await client.models.Milestone.update({
                        id,
                        ...updatedData,
                    });
                    console.log('📝 Milestone updated in cloud');
                } catch (cloudError) {
                    console.warn('❌ Cloud sync failed for milestone update:', cloudError);
                    // Local data is still updated
                }
            }
        } catch (error) {
            console.error('❌ Error updating milestone:', error);
        }
    };

    // === TASK FUNCTIONS ===
    const addTask = async (task) => {
        try {
            const newTask = {
                ...task,
                id: crypto.randomUUID(),
                timeSpent: 0,
                completed: false,
                milestoneId: task.milestoneId || null,
            };

            // Update local state immediately
            const updatedTasks = [...tasks, newTask];
            await updateTasksData(updatedTasks);

            // Sync to cloud if available
            if (client) {
                try {
                    await client.models.Task.create(newTask);
                    console.log('✅ Task synced to cloud:', newTask.name);
                } catch (cloudError) {
                    console.warn('❌ Cloud sync failed for task:', cloudError);
                    // Local data is still saved
                }
            }
        } catch (error) {
            console.error('❌ Error adding task:', error);
        }
    };

    const removeTask = async (id) => {
        try {
            if (!client) return;
            await client.models.Task.delete({ id });
            setTasks(prev => prev.filter(t => t.id !== id));
            console.log('🗑️ Task deleted');
        } catch (error) {
            console.error('❌ Error removing task:', error);
        }
    };

    const updateTask = async (id, updatedData) => {
        try {
            if (!client) return;
            const updated = await client.models.Task.update({
                id,
                ...updatedData,
            });
            setTasks(prev => prev.map(t => t.id === id ? updated.data : t));
            console.log('📝 Task updated');
        } catch (error) {
            console.error('❌ Error updating task:', error);
        }
    };

    const getTaskById = (id) => {
        return tasks.find(t => t.id === id);
    };

    const getMilestoneById = (id) => {
        return milestones.find(m => m.id === id);
    };

    const getTasksByMilestone = (milestoneId) => {
        return tasks.filter(t => t.milestoneId === milestoneId);
    };

    const logTimeForTask = async (id, seconds) => {
        try {
            if (!client) return;
            const task = tasks.find(t => t.id === id);
            const updated = await client.models.Task.update({
                id,
                timeSpent: (task.timeSpent || 0) + seconds,
            });
            setTasks(prev => prev.map(t => t.id === id ? updated.data : t));
            console.log('⏱️ Time logged:', seconds, 'seconds');
        } catch (error) {
            console.error('❌ Error logging time for task:', error);
        }
    };

    const toggleTaskCompletion = async (id) => {
        try {
            if (!client) return;
            const task = tasks.find(t => t.id === id);
            const updated = await client.models.Task.update({
                id,
                completed: !task.completed,
            });
            setTasks(prev => prev.map(t => t.id === id ? updated.data : t));
            console.log('✅ Task toggled:', updated.data.completed);
        } catch (error) {
            console.error('❌ Error toggling task completion:', error);
        }
    };

    // === SETTINGS FUNCTIONS ===
    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        const updatedSettings = { ...localSettings, theme: newTheme };
        await updateSettingsData(updatedSettings);
        console.log('🎨 Theme updated:', newTheme);
    };

    const setSemesterDates = async (start, end) => {
        const startISO = start.toISOString();
        const endISO = end.toISOString();
        const updatedSettings = { ...localSettings, semesterStart: startISO, semesterEnd: endISO };
        await updateSettingsData(updatedSettings);
        console.log('📅 Timeline dates updated');
    };

    const value = {
        milestones, tasks, theme, user, isLoading,
        semesterStart: new Date(semesterStart),
        semesterEnd: new Date(semesterEnd),
        addMilestone, removeMilestone, toggleMilestoneCompletion, updateMilestone,
        addTask, removeTask, updateTask, getTaskById, getMilestoneById, getTasksByMilestone,
        logTimeForTask, toggleTaskCompletion,
        toggleTheme, setSemesterDates,
        // Sync status for UI feedback
        syncStatus: {
            tasks: tasksSyncStatus,
            milestones: milestonesSyncStatus,
            settings: settingsSyncStatus
        },
        connectionError
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);