import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from 'date-fns';
import styled from 'styled-components';

const TasksContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.text};
    text-align: center;
`;

const FormContainer = styled.form`
    background: ${({ theme }) => theme.cardBg};
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FormTitle = styled.h2`
    margin: 0 0 1rem 0;
    text-align: center;
    color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.accent};
    }
`;

const TextArea = styled.textarea`
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.accent};
    }
`;

const SubmitButton = styled.button`
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    background: ${({ theme }) => theme.accent};
    color: white;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s ease;
    
    &:hover {
        opacity: 0.9;
    }
`;

const TasksList = styled.div`
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const TaskCard = styled.div`
    background: ${({ theme }) => theme.cardBg};
    border: 1px solid ${({ theme }) => theme.borderColor};
    padding: 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateY(-2px);
    }
`;

const TaskName = styled.h3`
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.text};
`;

const TaskDue = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.text}99;
    font-weight: 500;
`;

const DatePickerWrapper = styled.div`
    .react-datepicker-wrapper {
        width: 100%;
    }
    
    .react-datepicker__input-container input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid ${({ theme }) => theme.borderColor};
        border-radius: 8px;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        font-size: 1rem;
    }
`;

const ImminentTasks = () => {
    const { tasks, addTask } = useAppContext();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [approach, setApproach] = useState('');

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) =>
            differenceInDays(new Date(a.dueDate), new Date()) -
            differenceInDays(new Date(b.dueDate), new Date())
        );
    }, [tasks]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addTask({ name, dueDate: dueDate.toISOString(), approach });
        setName('');
        setApproach('');
    };

    const handleTaskClick = (taskId) => {
        if(window.confirm("Start this task now? This will take you to the immersive zone.")) {
            navigate(`/immersive/${taskId}`);
        }
    };

    return (
        <TasksContainer>
            <Title>Imminent Tasks</Title>

            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Add New Task</FormTitle>
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Task Name"
                    required
                />
                <DatePickerWrapper>
                    <DatePicker
                        selected={dueDate}
                        onChange={date => setDueDate(date)}
                        dateFormat="MMMM d, yyyy"
                    />
                </DatePickerWrapper>
                <TextArea
                    value={approach}
                    onChange={e => setApproach(e.target.value)}
                    placeholder="Method of approach (bullet points)"
                />
                <SubmitButton type="submit">Add Task</SubmitButton>
            </FormContainer>

            <TasksList>
                {sortedTasks.map(task => (
                    <TaskCard key={task.id} onClick={() => handleTaskClick(task.id)}>
                        <TaskName>{task.name}</TaskName>
                        <TaskDue>Due in: {differenceInDays(new Date(task.dueDate), new Date())} days</TaskDue>
                    </TaskCard>
                ))}
            </TasksList>
        </TasksContainer>
    );
};

export default ImminentTasks;