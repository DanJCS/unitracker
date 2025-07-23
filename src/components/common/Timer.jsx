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

    // Use a ref to hold the interval ID.
    const intervalRef = useRef(null);
    // Use a ref to hold the current seconds value to avoid stale closures in the unmount cleanup.
    const secondsRef = useRef(seconds);

    // This effect keeps the ref in sync with the state. It runs after every render.
    useEffect(() => {
        secondsRef.current = seconds;
    }, [seconds]);

    // This effect manages the setInterval based on the timer's status.
    useEffect(() => {
        if (status === 'running') {
            intervalRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        // Cleanup the interval when the effect re-runs or the component unmounts.
        return () => clearInterval(intervalRef.current);
    }, [status]); // Only depends on 'status'.

    // This effect handles logging the time ONLY when the component unmounts.
    useEffect(() => {
        // The return function is the cleanup function.
        return () => {
            // Read the latest value from the ref.
            if (secondsRef.current > 0) {
                onSessionEnd(secondsRef.current);
            }
        };
        // The empty dependency array [] is CRITICAL.
        // It ensures this effect runs only on mount, and its cleanup runs only on unmount.
    }, [onSessionEnd]); // Added onSessionEnd to dependencies to ensure it's not stale

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