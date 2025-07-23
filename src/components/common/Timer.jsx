// src/components/common/Timer.jsx

import React, { useState, useEffect } from 'react';
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

    &:hover {
        background: ${({ theme }) => theme.accent};
        color: white;
        border-color: ${({ theme }) => theme.accent};
    }
`;

const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const secs = timeInSeconds % 60;
        return [hours, minutes, secs]
            .map(v => v < 10 ? "0" + v : v)
            .join(":");
    };

    return (
        <div>
            <TimerDisplay>{formatTime(seconds)}</TimerDisplay>
            <ControlButton onClick={() => setIsActive(!isActive)}>
                {isActive ? 'Pause' : 'Resume'}
            </ControlButton>
        </div>
    );
};

export default Timer;