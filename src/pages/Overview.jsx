import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import OverviewProgressBar from '../components/OverviewProgressBar';
import { differenceInDays } from 'date-fns'; // NEW

const OverviewContainer = styled.div`
  text-align: center; /* Center the title */
`;

// NEW: Container for the stats
const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 2rem 0;
  text-align: center;
`;

const StatBox = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
  margin: 0;
`;

const StatLabel = styled.p`
    margin: 0.25rem 0 0 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text}99; /* Faded text color */
`;

const Overview = () => {
    const { milestones } = useAppContext();
    const semesterStart = new Date('2025-07-21');
    const semesterEnd = new Date('2025-10-27');
    const today = new Date();

    // NEW: Calculations for stats
    const totalDays = differenceInDays(semesterEnd, semesterStart);
    const elapsedDays = differenceInDays(today, semesterStart);
    const daysLeft = Math.max(0, differenceInDays(semesterEnd, today));
    const percentComplete = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));

    return (
        <OverviewContainer>
            <h1>Semester Overview</h1>

            {/* NEW: Display the stats */}
            <StatsContainer>
                <StatBox>
                    <StatValue>{Math.round(percentComplete)}%</StatValue>
                    <StatLabel>Semester Completed</StatLabel>
                </StatBox>
                <StatBox>
                    <StatValue>{daysLeft}</StatValue>
                    <StatLabel>Days Remaining</StatLabel>
                </StatBox>
            </StatsContainer>

            <OverviewProgressBar
                startDate={semesterStart}
                endDate={semesterEnd}
                milestones={milestones}
            />
        </OverviewContainer>
    );
};

export default Overview;