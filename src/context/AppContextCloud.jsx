import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { subDays, addDays } from 'date-fns';

const AppContext = createContext();

const defaultStartDate = subDays(new Date(), 30).toISOString();
const defaultEndDate = addDays(new Date(), 60).toISOString();

export const AppProvider = ({ children, user }) => {
    const [milestones, setMilestones] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [theme, setTheme] = useState('light');
    const [semesterStart, setSemesterStart] = useState(defaultStartDate);
    const [semesterEnd, setSemesterEnd] = useState(defaultEndDate);
    const [userSettings, setUserSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [client, setClient] = useState(null);

    console.log('✅ Using cloud-first context for user:', user?.username || user?.email);

    // Initialize GraphQL client
    useEffect(() => {
        try {
            const graphqlClient = generateClient();
            setClient(graphqlClient);
            console.log('✅ GraphQL client initialized');
        } catch (error) {
            console.error('❌ Failed to initialize GraphQL client:', error);
            setIsLoading(false);
        }
    }, []);

    // Load user data when client and user are ready
    useEffect(() => {
        if (client && user) {
            loadUserData();
        }
    }, [client, user]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            console.log('🔄 Loading user data from cloud...');
            
            // Load all user data from AWS
            const [tasksResult, milestonesResult, settingsResult] = await Promise.all([
                client.models.Task.list(),
                client.models.Milestone.list(),
                client.models.UserSettings.list()
            ]);

            console.log('📊 Loaded data:', {
                tasks: tasksResult.data?.length || 0,
                milestones: milestonesResult.data?.length || 0,
                settings: settingsResult.data?.length || 0
            });

            setTasks(tasksResult.data || []);
            setMilestones(milestonesResult.data || []);
            
            if (settingsResult.data && settingsResult.data.length > 0) {
                const settings = settingsResult.data[0];
                setUserSettings(settings);
                setTheme(settings.theme || 'light');
                setSemesterStart(settings.semesterStart || defaultStartDate);
                setSemesterEnd(settings.semesterEnd || defaultEndDate);
                console.log('⚙️ User settings loaded');
            } else {
                console.log('🆕 New user - creating default settings');
                await createDefaultSettings();
            }
        } catch (error) {
            console.error('❌ Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultSettings = async () => {
        try {
            if (!client) return;
            
            const settings = await client.models.UserSettings.create({
                theme: 'light',
                semesterStart: defaultStartDate,
                semesterEnd: defaultEndDate,
            });
            setUserSettings(settings.data);
            console.log('✅ Default settings created');
        } catch (error) {
            console.error('❌ Error creating default settings:', error);
        }
    };

    // === MILESTONE FUNCTIONS ===
    const addMilestone = async (milestone) => {
        try {
            if (!client) return;
            const newMilestone = await client.models.Milestone.create({
                name: milestone.name,
                date: milestone.date,
                description: milestone.description || '',
                completed: false,
                color: milestone.color || '#6366f1',
            });
            setMilestones(prev => [...prev, newMilestone.data]);
            console.log('✅ Milestone added:', newMilestone.data.name);
        } catch (error) {
            console.error('❌ Error adding milestone:', error);
        }
    };

    const removeMilestone = async (id) => {
        try {
            if (!client) return;
            await client.models.Milestone.delete({ id });
            setMilestones(prev => prev.filter(m => m.id !== id));
            console.log('🗑️ Milestone deleted');
        } catch (error) {
            console.error('❌ Error removing milestone:', error);
        }
    };

    const toggleMilestoneCompletion = async (id) => {
        try {
            if (!client) return;
            const milestone = milestones.find(m => m.id === id);
            const updated = await client.models.Milestone.update({
                id,
                completed: !milestone.completed,
            });
            setMilestones(prev => prev.map(m => m.id === id ? updated.data : m));
            console.log('✅ Milestone toggled:', updated.data.completed);
        } catch (error) {
            console.error('❌ Error toggling milestone completion:', error);
        }
    };

    const updateMilestone = async (id, updatedData) => {
        try {
            if (!client) return;
            const updated = await client.models.Milestone.update({
                id,
                ...updatedData,
            });
            setMilestones(prev => prev.map(m => m.id === id ? updated.data : m));
            console.log('📝 Milestone updated');
        } catch (error) {
            console.error('❌ Error updating milestone:', error);
        }
    };

    // === TASK FUNCTIONS ===
    const addTask = async (task) => {
        try {
            if (!client) return;
            const newTask = await client.models.Task.create({
                name: task.name,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                timeSpent: 0,
                completed: false,
                milestoneId: task.milestoneId || null,
            });
            setTasks(prev => [...prev, newTask.data]);
            console.log('✅ Task added:', newTask.data.name);
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
        setTheme(newTheme);
        
        if (userSettings && client) {
            try {
                const updated = await client.models.UserSettings.update({
                    id: userSettings.id,
                    theme: newTheme,
                });
                setUserSettings(updated.data);
                console.log('🎨 Theme updated:', newTheme);
            } catch (error) {
                console.error('❌ Error updating theme:', error);
            }
        }
    };

    const setSemesterDates = async (start, end) => {
        const startISO = start.toISOString();
        const endISO = end.toISOString();
        
        setSemesterStart(startISO);
        setSemesterEnd(endISO);
        
        if (userSettings && client) {
            try {
                const updated = await client.models.UserSettings.update({
                    id: userSettings.id,
                    semesterStart: startISO,
                    semesterEnd: endISO,
                });
                setUserSettings(updated.data);
                console.log('📅 Timeline dates updated');
            } catch (error) {
                console.error('❌ Error updating timeline dates:', error);
            }
        }
    };

    const value = {
        milestones, tasks, theme, user, isLoading,
        semesterStart: new Date(semesterStart),
        semesterEnd: new Date(semesterEnd),
        addMilestone, removeMilestone, toggleMilestoneCompletion, updateMilestone,
        addTask, removeTask, updateTask, getTaskById, getMilestoneById, getTasksByMilestone,
        logTimeForTask, toggleTaskCompletion,
        toggleTheme, setSemesterDates,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);