// src/components/common/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TimerDisplay = styled.div`
    font-size: 4rem; margin-top: 2rem; font-variant-numeric: tabular-nums;
`;

const ControlButton = styled.button`
    margin-top: 1rem; padding: 0.75rem 2rem;
    border: 1px solid ${({ theme }) => theme.borderColor}; border-radius: 8px;
    background: transparent; color: ${({ theme }) => theme.text};
    font-weight: 600; font-size: 1rem; cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;

    &:hover {
        background: ${({ theme }) => theme.accent};
        color: white; border-color: ${({ theme }) => theme.accent};
    }
`;

const Timer = ({ onSessionEnd }) => {
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState('idle'); // 'idle', 'running', 'paused'
    const intervalRef = useRef(null);

    useEffect(() => {
        if (status === 'running') {
            intervalRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [status]);

    // This effect calls the onSessionEnd when the component unmounts
    useEffect(() => {
        return () => {
            if (seconds > 0) {
                onSessionEnd(seconds);
            }
        };
    }, [seconds, onSessionEnd]);

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