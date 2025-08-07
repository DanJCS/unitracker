import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContextAmplify';
import OverviewProgressBar from '../components/OverviewProgressBar';
import { differenceInDays, isToday } from 'date-fns';

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

const TodayTasksSection = styled.div`
    width: 100%;
    max-width: 600px;
    margin-top: 2rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: ${({ theme }) => theme.text};
    text-align: left;
`;

const TasksList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const TaskItem = styled.div`
    background: ${({ theme }) => theme.cardBg};
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid ${({ color, theme }) => color || theme.accent};
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TaskInfo = styled.div`
    flex: 1;
`;

const TaskName = styled.h3`
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
`;

const TaskMeta = styled.p`
    margin: 0;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.text}80;
    display: flex;
    align-items: center;
`;

const MilestoneIndicator = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
    margin-right: 0.5rem;
`;

const NoTasksMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: ${({ theme }) => theme.text}60;
    font-style: italic;
`;

const Overview = () => {
    // Get everything from context now
    const { milestones, semesterStart, semesterEnd, tasks, getMilestoneById } = useAppContext();
    const today = new Date();

    // Filter tasks due today
    const todayTasks = tasks.filter(task => 
        !task.completed && isToday(new Date(task.dueDate))
    );

    const totalDays = differenceInDays(semesterEnd, semesterStart);
    const elapsedDays = differenceInDays(today, semesterStart);
    const daysLeft = Math.max(0, differenceInDays(semesterEnd, today));
    const percentComplete = totalDays > 0 ? Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100)) : 0;

    return (
        <OverviewContainer>
            <Title>Timeline Overview</Title>
            <StatsContainer>
                <StatBox>
                    <StatValue>{Math.round(percentComplete)}%</StatValue>
                    <StatLabel>Timeline Completed</StatLabel>
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
            <TodayTasksSection>
                <SectionTitle>Today's Tasks ({todayTasks.length})</SectionTitle>
                {todayTasks.length > 0 ? (
                    <TasksList>
                        {todayTasks.map(task => {
                            const milestone = task.milestoneId ? getMilestoneById(task.milestoneId) : null;
                            return (
                                <TaskItem key={task.id} color={milestone?.color}>
                                    <TaskInfo>
                                        <TaskName>{task.name}</TaskName>
                                        <TaskMeta>
                                            {milestone && (
                                                <>
                                                    <MilestoneIndicator color={milestone.color} />
                                                    {milestone.name}
                                                </>
                                            )}
                                        </TaskMeta>
                                    </TaskInfo>
                                </TaskItem>
                            );
                        })}
                    </TasksList>
                ) : (
                    <NoTasksMessage>No tasks due today! 🎉</NoTasksMessage>
                )}
            </TodayTasksSection>
        </OverviewContainer>
    );
};

export default Overview;