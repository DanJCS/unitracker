// src/components/common/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TimerDisplay = styled.div`
    font-size: 4rem;
    margin-top: 2rem;
    font-variant-numeric: tabular-nums;
`;

const ControlButton = styled.button`
    margin-top: 1rem;
    padding: 0.75rem 2rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    background: transparent;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;

    &:hover {
        background: ${({ theme }) => theme.accent};
        color: white;
        border-color: ${({ theme }) => theme.accent};
    }
`;

const Timer = ({ onSessionEnd }) => {
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState('idle'); // 'idle', 'running', 'paused'
    const workerRef = useRef(null);
    const secondsRef = useRef(seconds);

    // This effect keeps the ref in sync with the state. It runs after every render.
    useEffect(() => {
        secondsRef.current = seconds;
    }, [seconds]);

    // Initialize the worker
    useEffect(() => {
        try {
            // Create a new worker
            workerRef.current = new Worker(new URL('../../workers/timerWorker.js', import.meta.url));
            
            // Set up message handler
            const handleMessage = (e) => {
                const { seconds } = e.data;
                setSeconds(seconds);
            };
            
            // Set up error handler
            const handleError = (error) => {
                console.error('Timer worker error:', error);
            };
            
            workerRef.current.addEventListener('message', handleMessage);
            workerRef.current.addEventListener('error', handleError);
            
            // Clean up on unmount
            return () => {
                if (workerRef.current) {
                    workerRef.current.removeEventListener('message', handleMessage);
                    workerRef.current.removeEventListener('error', handleError);
                    workerRef.current.terminate();
                }
            };
        } catch (error) {
            console.error('Failed to initialize timer worker:', error);
        }
    }, []);

    // This effect handles controlling the worker based on the timer's status.
    useEffect(() => {
        if (!workerRef.current) return;
        
        if (status === 'running') {
            workerRef.current.postMessage({ 
                command: 'start', 
                seconds: secondsRef.current 
            });
        } else {
            workerRef.current.postMessage({ command: 'pause' });
        }
    }, [status]);

    // This effect handles logging the time ONLY when the component unmounts.
    useEffect(() => {
        // The return function is the cleanup function.
        return () => {
            // Get the latest seconds from the worker before unmounting
            if (workerRef.current) {
                workerRef.current.postMessage({ command: 'getSeconds' });
                
                // Set up a one-time message handler to get the current seconds
                const handleFinalSeconds = (e) => {
                    if (e.data.seconds > 0) {
                        onSessionEnd(e.data.seconds);
                    }
                    workerRef.current.removeEventListener('message', handleFinalSeconds);
                };
                
                workerRef.current.addEventListener('message', handleFinalSeconds);
            }
        };
    }, [onSessionEnd]);

    const handleToggle = () => {
        if (status === 'idle' || status === 'paused') {
            setStatus('running');
        } else if (status === 'running') {
            setStatus('paused');
        }
    };

    const getButtonLabel = () => {
        if (status === 'running') return 'Pause';
        if (status === 'paused') return 'Resume';
        return 'Start';
    };

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const secs = timeInSeconds % 60;
        return [hours, minutes, secs].map(v => (v < 10 ? "0" + v : v)).join(":");
    };

    return (
        <div>
            <TimerDisplay>{formatTime(seconds)}</TimerDisplay>
            <ControlButton onClick={handleToggle}>
                {getButtonLabel()}
            </ControlButton>
        </div>
    );
};

export default Timer;
