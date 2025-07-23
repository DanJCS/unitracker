import React from 'react';
import styled from 'styled-components';
import { differenceInDays, format } from 'date-fns';
// NEW: Import icons
import { FaCheck, FaHourglassHalf } from 'react-icons/fa';

const BarContainer = styled.div`
    position: relative;
    width: 100%;
    height: 25px;
    background: #E0E0E0;
    border-radius: 15px;
    margin-top: 4rem; /* More space for labels */
`;

const ProgressFill = styled.div`
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: #4CAF50; /* Green */
    border-radius: 15px;
`;

const MilestoneWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: ${({ position }) => position}%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// NEW: Label for the milestone
const MilestoneLabel = styled.span`
  position: absolute;
  bottom: 28px; /* Position above the marker */
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.body}E6; /* Slightly transparent body background */
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
`;

// UPDATED: Milestone Marker styles
const MilestoneMarker = styled.div`
  width: 28px;
  height: 28px;
  /* UPDATED: Blue for complete, Red for incomplete */
  background: ${({ completed }) => (completed ? '#3B82F6' : '#EF4444')};
  border-radius: 50%;
  border: 2px solid white;
  z-index: 10;
  cursor: pointer;
  
  /* NEW: Center the icon inside */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
`;

const OverviewProgressBar = ({ startDate, endDate, milestones }) => {
    // ... (calculations remain the same)
    const today = new Date();
    const totalDays = differenceInDays(endDate, startDate);
    const elapsedDays = differenceInDays(today, startDate);
    const progress = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));

    const getMilestonePosition = (milestoneDate) => {
        const daysFromStart = differenceInDays(new Date(milestoneDate), startDate);
        return (daysFromStart / totalDays) * 100;
    };

    return (
        <BarContainer>
            <ProgressFill progress={progress} />
            {milestones.map(m => (
                <MilestoneWrapper
                    key={m.id}
                    position={getMilestonePosition(m.date)}
                    title={`${m.name} - ${format(new Date(m.date), 'do MMM')}`}
                >
                    <MilestoneLabel>{m.name}</MilestoneLabel>
                    <MilestoneMarker completed={m.completed}>
                        {/* UPDATED: Render icon based on completion status */}
                        {m.completed ? <FaCheck /> : <FaHourglassHalf />}
                    </MilestoneMarker>
                </MilestoneWrapper>
            ))}
        </BarContainer>
    );
};

export default OverviewProgressBar;