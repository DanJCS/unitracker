import { generateClient } from 'aws-amplify/data';

export const hasLocalStorageData = () => {
    return !!(localStorage.getItem('tasks') || localStorage.getItem('milestones'));
};

export const isMigrationCompleted = () => {
    return localStorage.getItem('migrationCompleted') === 'true';
};

export const migrateLocalStorageToAmplify = async () => {
    try {
        const client = generateClient();
        let migrated = false;

        // Migrate tasks
        const tasksData = localStorage.getItem('tasks');
        if (tasksData) {
            const tasks = JSON.parse(tasksData);
            if (Array.isArray(tasks) && tasks.length > 0) {
                console.log(`Migrating ${tasks.length} tasks to Amplify...`);
                
                for (const task of tasks) {
                    try {
                        await client.models.Task.create({
                            name: task.name || 'Untitled Task',
                            description: task.description || '',
                            dueDate: task.dueDate || new Date().toISOString(),
                            priority: task.priority || 'medium',
                            timeSpent: task.timeSpent || 0,
                            completed: task.completed || false,
                        });
                    } catch (error) {
                        console.error('Error migrating task:', task.name, error);
                    }
                }
                migrated = true;
            }
        }

        // Migrate milestones
        const milestonesData = localStorage.getItem('milestones');
        if (milestonesData) {
            const milestones = JSON.parse(milestonesData);
            if (Array.isArray(milestones) && milestones.length > 0) {
                console.log(`Migrating ${milestones.length} milestones to Amplify...`);
                
                for (const milestone of milestones) {
                    try {
                        await client.models.Milestone.create({
                            name: milestone.name || 'Untitled Milestone',
                            date: milestone.date || new Date().toISOString(),
                            description: milestone.description || '',
                            completed: milestone.completed || false,
                        });
                    } catch (error) {
                        console.error('Error migrating milestone:', milestone.name, error);
                    }
                }
                migrated = true;
            }
        }

        // Mark migration as completed
        if (migrated) {
            localStorage.setItem('migrationCompleted', 'true');
            console.log('✅ Data migration completed successfully');
        } else {
            console.log('No data to migrate');
        }

    } catch (error) {
        console.error('❌ Error during data migration:', error);
        throw error;
    }
};