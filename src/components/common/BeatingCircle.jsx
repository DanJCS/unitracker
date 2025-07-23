import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const beat = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Circle = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 0 20px ${({ theme }) => theme.accent}40;
  animation: ${beat} 2s infinite ease-in-out;
  font-size: 1.5rem;
`;

const BeatingCircle = ({ points }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (points.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % points.length);
        }, 4000); // Change point every 4 seconds
        return () => clearInterval(interval);
    }, [points]);

    return <Circle>{points.length > 0 ? points[currentIndex] : 'Begin.'}</Circle>;
};

export default BeatingCircle;