// src/context/AppContextCloud.jsx

import React, { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import usePersistentState from '../hooks/usePersistentState';
import { subDays, addDays } from 'date-fns';

const AppContext = createContext();

const defaultStartDate = subDays(new Date(), 30).toISOString();
const defaultEndDate = addDays(new Date(), 60).toISOString();

export const AppProvider = ({ children }) => {
    const [milestones, setMilestones] = usePersistentState('milestones', []);
    const [tasks, setTasks] = usePersistentState('tasks', []);
    const [theme, setTheme] = usePersistentState('theme', 'light');
    const [semesterStart, setSemesterStart] = usePersistentState('semesterStart', defaultStartDate);
    const [semesterEnd, setSemesterEnd] = usePersistentState('semesterEnd', defaultEndDate);

    // --- Milestone Functions (unchanged) ---
    const addMilestone = (milestone) => {
        // Be explicit about the milestone shape
        const newMilestone = {
            id: uuidv4(),
            name: milestone.name,
            date: milestone.date,
            description: milestone.description || '', // Ensure description exists
            completed: false,
        };
        setMilestones([...milestones, newMilestone]);
    };
    const removeMilestone = (id) => { setMilestones(milestones.filter(m => m.id !== id)); };
    const toggleMilestoneCompletion = (id) => { setMilestones(milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m)); };
    const updateMilestone = (id, updatedData) => { setMilestones(milestones.map(m => m.id === id ? { ...m, ...updatedData } : m)); };

    // --- Task Functions (UPDATED) ---
    const addTask = (task) => {
        const newTask = {
            ...task,
            id: uuidv4(),
            timeSpent: 0,
            completed: false,
        };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (id) => { setTasks(tasks.filter(t => t.id !== id)); };

    const updateTask = (id, updatedData) => { setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t)); };

    const getTaskById = (id) => { return tasks.find(t => t.id === id); };

    // --- NEW Task Functions ---
    const logTimeForTask = (id, seconds) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, timeSpent: (t.timeSpent || 0) + seconds } : t
        ));
    };

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    // --- Other Functions (unchanged) ---
    const toggleTheme = () => { setTheme(theme === 'light' ? 'dark' : 'light'); };
    const setSemesterDates = (start, end) => { setSemesterStart(start.toISOString()); setSemesterEnd(end.toISOString()); };

    const value = {
        milestones, tasks, theme,
        semesterStart: new Date(semesterStart),
        semesterEnd: new Date(semesterEnd),
        addMilestone, removeMilestone, toggleMilestoneCompletion, updateMilestone,
        addTask, removeTask, updateTask, getTaskById,
        logTimeForTask, toggleTaskCompletion, // EXPORT NEW FUNCTIONS
        toggleTheme, setSemesterDates,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);