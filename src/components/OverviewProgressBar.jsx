import React from 'react';
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
`;

const ProgressFill = styled.div`
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 10px;
    transition: width 0.5s ease;
`;

const MilestoneWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: ${({ position }) => position}%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
`;

const MilestoneLabel = styled.span`
    position: absolute;
    bottom: 28px;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.cardBg};
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
    left: 50%;
    border: 1px solid ${({ theme }) => theme.borderColor};
`;

const MilestoneMarker = styled.div`
  width: 24px;
  height: 24px;
  background: ${({ completed, theme }) => (completed ? '#22c55e' : '#f97316')};
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  z-index: 20;
`;

const DatesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const OverviewProgressBar = ({ startDate, endDate, milestones }) => {
    const today = new Date();
    const totalDays = differenceInDays(endDate, startDate);
    const elapsedDays = differenceInDays(today, startDate);
    const progress = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));

    const getMilestonePosition = (milestoneDate) => {
        const daysFromStart = differenceInDays(new Date(milestoneDate), startDate);
        return (daysFromStart / totalDays) * 100;
    };

    return (
        <Container>
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
                            {m.completed ? <FaCheck /> : <FaHourglassHalf />}
                        </MilestoneMarker>
                    </MilestoneWrapper>
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