import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { subDays, addDays } from 'date-fns';
import usePersistentState from '../hooks/usePersistentState';
import { migrateLocalStorageToAmplify, hasLocalStorageData, isMigrationCompleted } from '../utils/dataMigration';

const AppContext = createContext();

// Initialize client lazily
let client = null;
const getClient = () => {
    if (!client) {
        try {
            client = generateClient();
            console.log('✅ GraphQL client initialized');
        } catch (error) {
            console.error('❌ Failed to initialize GraphQL client:', error);
            return null;
        }
    }
    return client;
};

const defaultStartDate = subDays(new Date(), 30).toISOString();
const defaultEndDate = addDays(new Date(), 60).toISOString();

export const AppProvider = ({ children, user }) => {
    const [milestones, setMilestones] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [theme, setTheme] = usePersistentState('theme', 'light');
    const [semesterStart, setSemesterStart] = usePersistentState('semesterStart', defaultStartDate);
    const [semesterEnd, setSemesterEnd] = usePersistentState('semesterEnd', defaultEndDate);
    const [userSettings, setUserSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            const graphqlClient = getClient();
            
            if (!graphqlClient) {
                console.warn('GraphQL client not available, using localStorage only');
                setIsLoading(false);
                return;
            }
            
            if (hasLocalStorageData() && !isMigrationCompleted()) {
                console.log('Found localStorage data, starting migration...');
                await migrateLocalStorageToAmplify();
            }
            
            const [tasksResult, milestonesResult, settingsResult] = await Promise.all([
                graphqlClient.models.Task.list(),
                graphqlClient.models.Milestone.list(),
                graphqlClient.models.UserSettings.list()
            ]);

            setTasks(tasksResult.data || []);
            setMilestones(milestonesResult.data || []);
            
            if (settingsResult.data && settingsResult.data.length > 0) {
                const settings = settingsResult.data[0];
                setUserSettings(settings);
                setTheme(settings.theme || 'light');
                if (settings.semesterStart) setSemesterStart(settings.semesterStart);
                if (settings.semesterEnd) setSemesterEnd(settings.semesterEnd);
            } else {
                await createDefaultSettings();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultSettings = async () => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) return;
            
            const settings = await graphqlClient.models.UserSettings.create({
                theme: 'light',
                semesterStart: defaultStartDate,
                semesterEnd: defaultEndDate,
            });
            setUserSettings(settings.data);
        } catch (error) {
            console.error('Error creating default settings:', error);
        }
    };

    const addMilestone = async (milestone) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) return;
            const newMilestone = await graphqlClient.models.Milestone.create({
                name: milestone.name,
                date: milestone.date,
                description: milestone.description || '',
                completed: false,
            });
            setMilestones(prev => [...prev, newMilestone.data]);
        } catch (error) {
            console.error('Error adding milestone:', error);
        }
    };

    const removeMilestone = async (id) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for milestone removal');
                return;
            }
            await graphqlClient.models.Milestone.delete({ id });
            setMilestones(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error removing milestone:', error);
        }
    };

    const toggleMilestoneCompletion = async (id) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for milestone toggle');
                return;
            }
            const milestone = milestones.find(m => m.id === id);
            const updated = await graphqlClient.models.Milestone.update({
                id,
                completed: !milestone.completed,
            });
            setMilestones(prev => prev.map(m => m.id === id ? updated.data : m));
        } catch (error) {
            console.error('Error toggling milestone completion:', error);
        }
    };

    const updateMilestone = async (id, updatedData) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for milestone update');
                return;
            }
            const updated = await graphqlClient.models.Milestone.update({
                id,
                ...updatedData,
            });
            setMilestones(prev => prev.map(m => m.id === id ? updated.data : m));
        } catch (error) {
            console.error('Error updating milestone:', error);
        }
    };

    const addTask = async (task) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for task creation');
                return;
            }
            const newTask = await graphqlClient.models.Task.create({
                name: task.name,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                timeSpent: 0,
                completed: false,
            });
            setTasks(prev => [...prev, newTask.data]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const removeTask = async (id) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for task removal');
                return;
            }
            await graphqlClient.models.Task.delete({ id });
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error removing task:', error);
        }
    };

    const updateTask = async (id, updatedData) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for task update');
                return;
            }
            const updated = await graphqlClient.models.Task.update({
                id,
                ...updatedData,
            });
            setTasks(prev => prev.map(t => t.id === id ? updated.data : t));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const getTaskById = (id) => {
        return tasks.find(t => t.id === id);
    };

    const logTimeForTask = async (id, seconds) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for time logging');
                return;
            }
            const task = tasks.find(t => t.id === id);
            const updated = await graphqlClient.models.Task.update({
                id,
                timeSpent: (task.timeSpent || 0) + seconds,
            });
            setTasks(prev => prev.map(t => t.id === id ? updated.data : t));
        } catch (error) {
            console.error('Error logging time for task:', error);
        }
    };

    const toggleTaskCompletion = async (id) => {
        try {
            const graphqlClient = getClient();
            if (!graphqlClient) {
                console.warn('GraphQL client not available for task toggle');
                return;
            }
            const task = tasks.find(t => t.id === id);
            const updated = await graphqlClient.models.Task.update({
                id,
                completed: !task.completed,
            });
            setTasks(prev => prev.map(t => t.id === id ? updated.data : t));
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        if (userSettings) {
            try {
                const graphqlClient = getClient();
                if (!graphqlClient) {
                    console.warn('GraphQL client not available for theme update');
                    return;
                }
                const updated = await graphqlClient.models.UserSettings.update({
                    id: userSettings.id,
                    theme: newTheme,
                });
                setUserSettings(updated.data);
            } catch (error) {
                console.error('Error updating theme:', error);
            }
        }
    };

    const setSemesterDates = async (start, end) => {
        const startISO = start.toISOString();
        const endISO = end.toISOString();
        
        setSemesterStart(startISO);
        setSemesterEnd(endISO);
        
        if (userSettings) {
            try {
                const graphqlClient = getClient();
                if (!graphqlClient) {
                    console.warn('GraphQL client not available for semester dates update');
                    return;
                }
                const updated = await graphqlClient.models.UserSettings.update({
                    id: userSettings.id,
                    semesterStart: startISO,
                    semesterEnd: endISO,
                });
                setUserSettings(updated.data);
            } catch (error) {
                console.error('Error updating semester dates:', error);
            }
        }
    };

    const value = {
        milestones, tasks, theme, user, isLoading,
        semesterStart: new Date(semesterStart),
        semesterEnd: new Date(semesterEnd),
        addMilestone, removeMilestone, toggleMilestoneCompletion, updateMilestone,
        addTask, removeTask, updateTask, getTaskById,
        logTimeForTask, toggleTaskCompletion,
        toggleTheme, setSemesterDates,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);