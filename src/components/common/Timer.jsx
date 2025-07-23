import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimerDisplay = styled.div`
  font-size: 4rem;
  margin-top: 2rem;
  font-variant-numeric: tabular-nums;
`;
// ... add styled-components for buttons

const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

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
            <button onClick={() => setIsActive(!isActive)}>
                {isActive ? 'Pause' : 'Resume'}
            </button>
        </div>
    );
};

export default Timer;