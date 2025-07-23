import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

const beat = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const Circle = styled.div`
    width: 300px;
    height: 300px;
    border-radius: 50%;
    /* The background now uses a semi-transparent version of the text color for contrast */
    background: ${({ theme }) => theme.name === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
    backdrop-filter: blur(10px);
    /* The text color is now inherited from the theme */
    color: ${({ theme }) => theme.text};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 0 20px ${({ theme }) => theme.accent}40;
    animation: ${beat} 3s infinite ease-in-out;
    font-size: 1.25rem;
    line-height: 1.6;
    border: 1px solid ${({ theme }) => theme.borderColor};
`;

const PointText = styled.div`
  margin-bottom: 1.5rem;
`;

const Indicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  opacity: 0.8;
`;

const BeatingCircle = ({ points }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (points.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % points.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [points]);

    return (
        <Circle>
            <PointText>
                {points.length > 0 ? points[currentIndex] : 'Begin your focused work session.'}
            </PointText>
            <Indicator>
                <FaCheck /> {currentIndex + 1} of {points.length || 1}
                <FaArrowRight />
            </Indicator>
        </Circle>
    );
};

export default BeatingCircle;