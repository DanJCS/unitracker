// src/components/OverviewProgressBar.jsx

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { differenceInDays, format } from 'date-fns';
import { FaCheck, FaHourglassHalf } from 'react-icons/fa';

const Container = styled.div`
    margin-top: 3rem;
    padding: 0 1rem;
`;

const BarContainer = styled.div`
    position: relative;
    width: 100%;
    height: 20px;
    background: ${({ theme }) => theme.cardBg};
    border-radius: 10px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 3rem;
    margin-bottom: 3rem;
`;

const ProgressFill = styled.div`
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 10px;
    transition: width 0.5s ease;
`;

// --- UPDATED MILESTONE WRAPPER ---
const MilestoneWrapper = styled.div`
    position: absolute;
    left: ${({ position }) => position}%;
    top: ${({ vOffset }) => (vOffset === 'up' ? '50%' : 'auto')};
    bottom: ${({ vOffset }) => (vOffset === 'down' ? '50%' : 'auto')};
    transform: translate(-50%, ${({ vOffset }) => (vOffset === 'up' ? '-180%' : '180%')});
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: ${({ isHovered }) => (isHovered ? 30 : 10)};
    margin-top: ${({ vOffset }) => (vOffset === 'down' ? '30px' : '0')};
    margin-bottom: ${({ vOffset }) => (vOffset === 'up' ? '30px' : '0')};
    transition: all 0.2s ease;
`;
// --- END OF UPDATE ---

// --- UPDATED MILESTONE LABEL ---
const MilestoneLabel = styled.span`
    position: relative;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${({ theme, isHovered }) => (isHovered ? '#ffffff' : theme.text)};
    background: ${({ theme, isHovered }) =>
            isHovered ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : theme.cardBg};
    padding: 6px 10px;
    border-radius: 6px;
    white-space: nowrap;
    box-shadow: ${({ isHovered }) =>
            isHovered ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
    border: 1px solid ${({ theme, isHovered }) =>
            isHovered ? '#8b5cf6' : theme.borderColor};
    transition: all 0.2s ease;
    transform: ${({ isHovered }) => isHovered ? 'scale(1.05)' : 'scale(1)'};

    &::before {
        content: '';
        position: absolute;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        transform: translateX(-50%);
        top: ${({ vOffset }) => (vOffset === 'up' ? '100%' : '-11px')};
        border-top: ${({ vOffset, theme }) => (vOffset === 'up' ? `10px solid ${theme.borderColor}` : 'none')};
        border-bottom: ${({ vOffset, theme }) => (vOffset === 'down' ? `10px solid ${theme.borderColor}` : 'none')};
    }
    &::after {
        content: '';
        position: absolute;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        transform: translateX(-50%);
        top: ${({ vOffset }) => (vOffset === 'up' ? '100%' : '-9px')};
        border-top: ${({ vOffset, theme }) => (vOffset === 'up' ? `9px solid ${theme.cardBg}` : 'none')};
        border-bottom: ${({ vOffset, theme }) => (vOffset === 'down' ? `9px solid ${theme.cardBg}` : 'none')};
    }
`;
// --- END OF UPDATE ---

// --- UPDATED MILESTONE MARKER ---
const MilestoneMarker = styled.div`
    width: 24px;
    height: 24px;
    background: ${({ completed }) => (completed ? '#22c55e' : '#f97316')};
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.7rem;
    z-index: 20;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) ${({ isHovered }) => isHovered ? 'scale(1.2)' : 'scale(1)'};
    transition: all 0.2s ease;
    cursor: pointer;
`;
// --- END OF UPDATE ---

const DatesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};
    opacity: 0.8;
`;

const OverviewProgressBar = ({ startDate, endDate, milestones }) => {
    const totalDays = differenceInDays(endDate, startDate) || 1;

    // --- ADD STATE FOR HOVERED MILESTONE ---
    const [hoveredMilestoneId, setHoveredMilestoneId] = React.useState(null);
    // --- END OF ADDITION ---

    const positionedMilestones = useMemo(() => {
        if (!milestones || milestones.length === 0) return [];

        const sorted = milestones
            .map((m) => ({
                ...m,
                position: (differenceInDays(new Date(m.date), startDate) / totalDays) * 100,
            }))
            .sort((a, b) => a.position - b.position);

        let lastTopPos = -Infinity;
        let lastBottomPos = -Infinity;
        const labelWidthPercentage = 10;

        return sorted.map((milestone) => {
            let vOffset = 'up';

            if (milestone.position < lastTopPos + labelWidthPercentage) {
                if (milestone.position < lastBottomPos + labelWidthPercentage) {
                    vOffset = 'down';
                } else {
                    vOffset = 'down';
                }
            }

            if (vOffset === 'up') {
                lastTopPos = milestone.position;
            } else {
                lastBottomPos = milestone.position;
            }

            return { ...milestone, vOffset };
        });
    }, [milestones, startDate, totalDays]);

    const today = new Date();
    const elapsedDays = differenceInDays(today, startDate);
    const progress = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));

    return (
        <Container>
            <BarContainer>
                <ProgressFill progress={progress} />
                {positionedMilestones.map((m) => (
                    <MilestoneWrapper
                        key={m.id}
                        position={m.position}
                        vOffset={m.vOffset}
                        isHovered={hoveredMilestoneId === m.id}
                        title={`${m.name} - ${format(new Date(m.date), 'do MMM')}`}
                    >
                        <MilestoneLabel
                            vOffset={m.vOffset}
                            isHovered={hoveredMilestoneId === m.id}
                        >
                            {m.name}
                        </MilestoneLabel>
                    </MilestoneWrapper>
                ))}
                {positionedMilestones.map((m) => (
                    <MilestoneMarker
                        key={`${m.id}-marker`}
                        style={{ left: `${m.position}%` }}
                        completed={m.completed}
                        isHovered={hoveredMilestoneId === m.id}
                        // --- ADD HOVER HANDLERS ---
                        onMouseEnter={() => setHoveredMilestoneId(m.id)}
                        onMouseLeave={() => setHoveredMilestoneId(null)}
                        // --- END OF ADDITION ---
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