import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import BeatingCircle from '../components/common/BeatingCircle';
import Timer from '../components/common/Timer';

const ZoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const TaskName = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const ImmersiveZone = () => {
    const { taskId } = useParams();
    const { getTaskById } = useAppContext();
    const task = getTaskById(taskId);

    if (!task) {
        return <div>Task not found!</div>;
    }

    const approachPoints = task.approach.split('\n').filter(line => line.trim() !== '');

    return (
        <ZoneContainer>
            <TaskName>{task.name}</TaskName>
            <BeatingCircle points={approachPoints} />
            <Timer />
        </ZoneContainer>
    );
};

export default ImmersiveZone;