import { generateClient } from 'aws-amplify/data';

const client = generateClient();

export const migrateLocalStorageToAmplify = async () => {
    try {
        const existingTasks = localStorage.getItem('tasks');
        const existingMilestones = localStorage.getItem('milestones');
        const existingTheme = localStorage.getItem('theme');
        const existingSemesterStart = localStorage.getItem('semesterStart');
        const existingSemesterEnd = localStorage.getItem('semesterEnd');

        if (existingTasks) {
            const tasks = JSON.parse(existingTasks);
            console.log('Migrating', tasks.length, 'tasks...');
            
            for (const task of tasks) {
                await client.models.Task.create({
                    name: task.name,
                    description: task.description || '',
                    dueDate: task.dueDate,
                    priority: task.priority || 'medium',
                    timeSpent: task.timeSpent || 0,
                    completed: task.completed || false,
                });
            }
        }

        if (existingMilestones) {
            const milestones = JSON.parse(existingMilestones);
            console.log('Migrating', milestones.length, 'milestones...');
            
            for (const milestone of milestones) {
                await client.models.Milestone.create({
                    name: milestone.name,
                    date: milestone.date,
                    description: milestone.description || '',
                    completed: milestone.completed || false,
                });
            }
        }

        const theme = existingTheme ? JSON.parse(existingTheme) : 'light';
        const semesterStart = existingSemesterStart ? JSON.parse(existingSemesterStart) : null;
        const semesterEnd = existingSemesterEnd ? JSON.parse(existingSemesterEnd) : null;

        await client.models.UserSettings.create({
            theme,
            semesterStart,
            semesterEnd,
        });

        localStorage.setItem('amplify_migration_completed', 'true');
        console.log('Migration completed successfully');
        
        return true;
    } catch (error) {
        console.error('Error during migration:', error);
        return false;
    }
};

export const hasLocalStorageData = () => {
    return localStorage.getItem('tasks') || localStorage.getItem('milestones');
};

export const isMigrationCompleted = () => {
    return localStorage.getItem('amplify_migration_completed') === 'true';
};