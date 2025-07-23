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
    // ... timer logic from before (I will fix the useEffect bug here as planned)
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        // The `else` block is removed to fix the bug.
        // `clearInterval` is only called on cleanup or when isActive becomes false.
        return () => clearInterval(interval);
    }, [isActive]); // The `seconds` dependency is removed to fix the bug.

    const formatTime = (timeInSeconds) => {
        // ... formatTime logic from before
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