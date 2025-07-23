// src/components/common/CompletedTasksModal.jsx

import React from 'react';
import styled from 'styled-components';
import { formatTimeSpent } from '../../utils/timeFormatter';

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
    justify-content: center; z-index: 2000;
`;
const ModalContent = styled.div`
    background: ${({ theme }) => theme.cardBg}; padding: 2rem;
    border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    width: 100%; max-width: 600px; color: ${({ theme }) => theme.text};
    max-height: 80vh; display: flex; flex-direction: column;
`;
const ModalTitle = styled.h2`
    margin-top: 0; margin-bottom: 1.5rem; text-align: center;
`;
const TaskList = styled.div`
    overflow-y: auto;
    padding-right: 1rem; // For scrollbar spacing
`;
const CompletedTaskItem = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem; border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    &:last-child { border-bottom: none; }
`;
const TaskName = styled.span`
    font-weight: 500;
`;
const TimeSpent = styled.span`
    color: ${({ theme }) => theme.text}99;
    font-style: italic;
`;
const CloseButton = styled.button`
    margin-top: 1.5rem; padding: 0.6rem 1.2rem; align-self: flex-end;
    /* Using styles from EditModal for consistency */
    border-radius: 8px; cursor: pointer; font-weight: 600;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: transparent; color: ${({ theme }) => theme.text};
    transition: opacity 0.2s ease; &:hover { opacity: 0.85; }
`;

const CompletedTasksModal = ({ isOpen, onClose, tasks }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>Completed Tasks</ModalTitle>
                <TaskList>
                    {tasks.length > 0 ? tasks.map(task => (
                        <CompletedTaskItem key={task.id}>
                            <TaskName>{task.name}</TaskName>
                            <TimeSpent>{formatTimeSpent(task.timeSpent)}</TimeSpent>
                        </CompletedTaskItem>
                    )) : <p>No completed tasks yet.</p>}
                </TaskList>
                <CloseButton onClick={onClose}>Close</CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CompletedTasksModal;