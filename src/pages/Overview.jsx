import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContextFallback';
import OverviewProgressBar from '../components/OverviewProgressBar';
import { differenceInDays } from 'date-fns';

const OverviewContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2rem;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.text};

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const StatsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    width: 100%;
    max-width: 500px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const StatBox = styled.div`
    background: ${({ theme }) => theme.cardBg};
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const StatValue = styled.p`
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.accent};
    margin: 0;
    line-height: 1;
`;

const StatLabel = styled.p`
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text}99;
    font-weight: 500;
`;

const ProgressContainer = styled.div`
    width: 100%;
    max-width: 600px;
    margin-top: 1rem;
`;

const Overview = () => {
    // Get everything from context now
    const { milestones, semesterStart, semesterEnd } = useAppContext();
    const today = new Date();

    const totalDays = differenceInDays(semesterEnd, semesterStart);
    const elapsedDays = differenceInDays(today, semesterStart);
    const daysLeft = Math.max(0, differenceInDays(semesterEnd, today));
    const percentComplete = totalDays > 0 ? Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100)) : 0;

    return (
        <OverviewContainer>
            <Title>Semester Overview</Title>
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
            <ProgressContainer>
                <OverviewProgressBar
                    startDate={semesterStart}
                    endDate={semesterEnd}
                    milestones={milestones}
                />
            </ProgressContainer>
        </OverviewContainer>
    );
};

export default Overview;