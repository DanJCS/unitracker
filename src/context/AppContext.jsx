import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Run `npm install uuid` for unique IDs

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [milestones, setMilestones] = useState([
        { id: 'm1', name: 'Project Proposal Due', date: '2025-08-15', completed: true },
        { id: 'm2', name: 'Mid-term Exam', date: '2025-09-10', completed: false },
    ]);
    const [tasks, setTasks] = useState([
        { id: 't1', name: 'Research for Essay', dueDate: '2025-07-30', approach: '• Find 5 academic sources\n• Summarize key points' },
    ]);
    const [theme, setTheme] = useState('light');

    const addMilestone = (milestone) => {
        setMilestones([...milestones, { ...milestone, id: uuidv4(), completed: false }]);
    };

    const toggleMilestoneCompletion = (id) => {
        setMilestones(milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
    };

    const addTask = (task) => {
        setTasks([...tasks, { ...task, id: uuidv4() }]);
    };

    const getTaskById = (id) => {
        return tasks.find(t => t.id === id);
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const value = {
        milestones,
        tasks,
        theme,
        addMilestone,
        toggleMilestoneCompletion,
        addTask,
        getTaskById,
        toggleTheme,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);