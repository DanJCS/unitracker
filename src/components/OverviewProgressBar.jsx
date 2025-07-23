// src/components/OverviewProgressBar.jsx

import React, { useMemo } from 'react'; // <--- FIX: Added useMemo
import styled from 'styled-components';
import { differenceInDays, format } from 'date-fns';
import { FaCheck, FaHourglassHalf } from 'react-icons/fa';

const Container = styled.div` margin-top: 3rem; padding: 0 1rem; `;
const BarContainer = styled.div`
    position: relative; width: 100%; height: 20px;
    background: ${({ theme }) => theme.cardBg}; border-radius: 10px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
    margin-bottom: 2rem;
`;
const ProgressFill = styled.div`
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 10px;
    transition: width 0.5s ease;
`;
const DatesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};
    opacity: 0.8;
`;

const MilestoneWrapper = styled.div`
    position: absolute;
    left: ${({ position }) => position}%;
    top: ${({ vOffset }) => vOffset === 'up' ? '50%' : 'auto'};
    bottom: ${({ vOffset }) => vOffset === 'down' ? '50%' : 'auto'};
    transform: translate(-50%, ${({ vOffset }) => vOffset === 'up' ? '-100%' : '100%'});
    display: flex; flex-direction: column; align-items: center; z-index: 10;
`;

const MilestoneLabel = styled.span`
    position: relative;
    font-size: 0.8rem; font-weight: 500; color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.cardBg}; padding: 6px 10px;
    border-radius: 6px; white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    border: 1px solid ${({ theme }) => theme.borderColor};
    
    &::after {
        content: ''; position: absolute; left: 50%;
        transform: translateX(-50%);
        width: 0; height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        top: ${({ vOffset }) => vOffset === 'up' ? '100%' : 'auto'};
        bottom: ${({ vOffset }) => vOffset === 'down' ? '100%' : 'auto'};
        border-bottom: ${({ vOffset, theme }) => vOffset === 'up' ? 'none' : `6px solid ${theme.cardBg}`};
        border-top: ${({ vOffset, theme }) => vOffset === 'down' ? 'none' : `6px solid ${theme.cardBg}`};
    }
    &::before {
        content: ''; position: absolute; left: 50%;
        transform: translateX(-50%);
        width: 0; height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        top: ${({ vOffset }) => vOffset === 'up' ? '100%' : '-7px'};
        bottom: ${({ vOffset }) => vOffset === 'down' ? '100%' : 'auto'};
        border-bottom: ${({ vOffset, theme }) => vOffset === 'up' ? 'none' : `7px solid ${theme.borderColor}`};
        border-top: ${({ vOffset, theme }) => vOffset === 'down' ? 'none' : `7px solid ${theme.borderColor}`};
    }
`;

const MilestoneMarker = styled.div`
    width: 24px; height: 24px;
    background: ${({ completed }) => (completed ? '#22c55e' : '#f97316')};
    border-radius: 50%; border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.7rem; z-index: 20;
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
`;

const OverviewProgressBar = ({ startDate, endDate, milestones }) => {
    const totalDays = differenceInDays(endDate, startDate) || 1;

    const positionedMilestones = useMemo(() => {
        if (!milestones || milestones.length === 0) return [];

        const sorted = milestones.map(m => ({
            ...m,
            position: (differenceInDays(new Date(m.date), startDate) / totalDays) * 100
        })).sort((a, b) => a.position - b.position);

        let lastPos = -10;
        return sorted.map((m, index) => {
            let vOffset = 'up';
            if (index > 0 && m.position < sorted[index-1].position + 8) { // 8% threshold for overlap
                vOffset = sorted[index - 1].vOffset === 'up' ? 'down' : 'up';
            }
            return { ...m, vOffset };
        });
    }, [milestones, startDate, totalDays]);

    const today = new Date();
    const elapsedDays = differenceInDays(today, startDate);
    const progress = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));

    return (
        <Container>
            <BarContainer>
                <ProgressFill progress={progress} />
                {positionedMilestones.map(m => (
                    <MilestoneWrapper
                        key={m.id}
                        position={m.position}
                        vOffset={m.vOffset}
                        title={`${m.name} - ${format(new Date(m.date), 'do MMM')}`}
                    >
                        <MilestoneLabel vOffset={m.vOffset}>{m.name}</MilestoneLabel>
                    </MilestoneWrapper>
                ))}
                {positionedMilestones.map(m => (
                    <MilestoneMarker
                        key={`${m.id}-marker`}
                        style={{ left: `${m.position}%` }}
                        completed={m.completed}
                    >
                        {m.completed ? <FaCheck /> : <FaHourglassHalf />}
                    </MilestoneMarker>
                ))}
            </BarContainer>
            <DatesContainer>
                <span>{format(startDate, 'MMM d, yyyy')}</span>
                <span>{format(endDate, 'MMM d, yyyy')}</span>
            </DatesContainer>
        </Container>
    );
};

export default OverviewProgressBar;