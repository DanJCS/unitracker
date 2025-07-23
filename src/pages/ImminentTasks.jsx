import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from 'date-fns';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';

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

const getGlow = (daysLeft, theme) => {
    const baseShadow = `0 4px 12px rgba(0,0,0,0.1)`;
    if (daysLeft < 0) return baseShadow;
    let glowColor;
    if (daysLeft === 0) glowColor = '#ef4444';
    else if (daysLeft === 1) glowColor = '#f97316';
    else if (daysLeft <= 5) glowColor = '#eab308';
    else return baseShadow;
    return `0 0 12px 2px ${glowColor}60, ${baseShadow}`;
};

const TaskCard = styled.div`
    position: relative;
    background: ${({ theme }) => theme.cardBg};
    border: 1px solid ${({ theme }) => theme.borderColor};
    padding: 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    box-shadow: ${({ daysLeft, theme }) => getGlow(daysLeft, theme)};
    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ daysLeft, theme }) => getGlow(daysLeft, theme).replace('0.1', '0.2')};
    }
`;

const CardActions = styled.div`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.25rem;
`;

const ActionButton = styled.button`
    background: none; border: none; color: ${({ theme }) => theme.text}60;
    cursor: pointer; font-size: 0.9rem; padding: 0.5rem; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
    &:hover {
        background: ${({ hoverBg }) => hoverBg || '#ef44441a'};
        color: ${({ hoverColor }) => hoverColor || '#ef4444'};
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
    const { tasks, addTask, removeTask, updateTask } = useAppContext();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [approach, setApproach] = useState('');
    const approachRef = useRef(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) =>
            differenceInDays(new Date(a.dueDate), new Date()) -
            differenceInDays(new Date(b.dueDate), new Date())
        );
    }, [tasks]);

    const handleSubmit = (e) => { e.preventDefault(); if (!name.trim()) return; const finalApproach = approach.trim() === '•' ? '' : approach; addTask({ name, dueDate: dueDate.toISOString(), approach: finalApproach }); setName(''); setApproach(''); };
    const handleTaskClick = (taskId) => { if(window.confirm("Start this task now? This will take you to the immersive zone.")) { navigate(`/immersive/${taskId}`); } };
    const handleRemoveTask = (e, taskId) => { e.stopPropagation(); if (window.confirm("Are you sure you want to delete this task?")) { removeTask(taskId); }};
    const handleApproachChange = (e) => { let value = e.target.value; if (value === '') { setApproach(''); return; } if (!value.startsWith('• ')) { value = '• ' + value.trimStart(); } setApproach(value); };
    const handleApproachKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); const { value, selectionStart } = e.target; const newValue = value.substring(0, selectionStart) + '\n• ' + value.substring(selectionStart); setApproach(newValue); requestAnimationFrame(() => { if (approachRef.current) { const newCursorPosition = selectionStart + 3; approachRef.current.selectionStart = newCursorPosition; approachRef.current.selectionEnd = newCursorPosition; } }); } };
    const handleOpenEditModal = (e, task) => { e.stopPropagation(); setEditingTask(task); setEditModalOpen(true); };
    const handleSaveTask = (updatedData) => { if (editingTask) { updateTask(editingTask.id, updatedData); } };

    return (
        <TasksContainer>
            <Title>Imminent Tasks</Title>
            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Add New Task</FormTitle>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Task Name" required />
                <DatePickerWrapper>
                    <DatePicker selected={dueDate} onChange={date => setDueDate(date)} dateFormat="MMMM d, yyyy" />
                </DatePickerWrapper>
                <TextArea ref={approachRef} value={approach} onChange={handleApproachChange} onKeyDown={handleApproachKeyDown} placeholder="Method of approach (bullet points)" />
                <SubmitButton type="submit">Add Task</SubmitButton>
            </FormContainer>
            <TasksList>
                {sortedTasks.map(task => {
                    const daysLeft = differenceInDays(new Date(task.dueDate), new Date());
                    return (
                        <TaskCard key={task.id} onClick={() => handleTaskClick(task.id)} daysLeft={daysLeft}>
                            <CardActions>
                                <ActionButton onClick={(e) => handleOpenEditModal(e, task)} hoverColor="#6366f1" hoverBg="#6366f11a">
                                    <FaPencilAlt />
                                </ActionButton>
                                <ActionButton onClick={(e) => handleRemoveTask(e, task.id)}>
                                    <FaTrash />
                                </ActionButton>
                            </CardActions>
                            <TaskName>{task.name}</TaskName>
                            <TaskDue>{daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} days` : `Due in: ${daysLeft} days`}</TaskDue>
                        </TaskCard>
                    );
                })}
            </TasksList>
            <EditModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} item={editingTask} onSave={handleSaveTask} />
        </TasksContainer>
    );
};

export default ImminentTasks;