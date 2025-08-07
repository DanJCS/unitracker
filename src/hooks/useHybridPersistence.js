// src/hooks/useHybridPersistence.js

import { useState, useEffect, useCallback } from 'react';

/**
 * Hybrid persistence hook that combines cloud storage with localStorage fallback
 * Provides offline-first behavior with cloud sync when available
 */
function useHybridPersistence(key, initialValue, cloudOperations = {}) {
    const [state, setState] = useState(initialValue);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error, synced

    // Load data on mount - prioritize localStorage for immediate availability
    useEffect(() => {
        const loadData = async () => {
            try {
                // Always load from localStorage first for instant UI
                const localData = localStorage.getItem(key);
                if (localData) {
                    setState(JSON.parse(localData));
                }

                // Attempt cloud sync if online and cloud operations available
                if (isOnline && cloudOperations.load) {
                    setSyncStatus('syncing');
                    try {
                        const cloudData = await cloudOperations.load();
                        if (cloudData) {
                            setState(cloudData);
                            localStorage.setItem(key, JSON.stringify(cloudData));
                            setSyncStatus('synced');
                        }
                    } catch (cloudError) {
                        console.warn(`Cloud sync failed for ${key}:`, cloudError);
                        setSyncStatus('error');
                        // Continue using localStorage data
                    }
                }
            } catch (error) {
                console.error(`Error loading data for ${key}:`, error);
                setState(initialValue);
            }
        };

        loadData();
    }, [key, initialValue, isOnline, cloudOperations]);

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Update function with hybrid persistence
    const updateState = useCallback(async (newState) => {
        try {
            setState(newState);
            
            // Always save to localStorage immediately
            localStorage.setItem(key, JSON.stringify(newState));

            // Attempt cloud save if online
            if (isOnline && cloudOperations.save) {
                setSyncStatus('syncing');
                try {
                    await cloudOperations.save(newState);
                    setSyncStatus('synced');
                } catch (cloudError) {
                    console.warn(`Cloud save failed for ${key}:`, cloudError);
                    setSyncStatus('error');
                    // Data is still saved locally, so operation succeeds
                }
            } else {
                setSyncStatus('offline');
            }
        } catch (error) {
            console.error(`Error updating ${key}:`, error);
            throw error;
        }
    }, [key, isOnline, cloudOperations]);

    // Force sync function
    const forceSync = useCallback(async () => {
        if (!isOnline || !cloudOperations.load || !cloudOperations.save) {
            return false;
        }

        try {
            setSyncStatus('syncing');
            
            // Load latest from cloud
            const cloudData = await cloudOperations.load();
            if (cloudData) {
                setState(cloudData);
                localStorage.setItem(key, JSON.stringify(cloudData));
            }
            
            setSyncStatus('synced');
            return true;
        } catch (error) {
            console.error(`Force sync failed for ${key}:`, error);
            setSyncStatus('error');
            return false;
        }
    }, [key, isOnline, cloudOperations]);

    return {
        data: state,
        updateData: updateState,
        isOnline,
        syncStatus,
        forceSync
    };
}

export default useHybridPersistence;