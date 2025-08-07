// src/pages/ImminentTasks.jsx

import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContextAmplify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from 'date-fns';
import styled from 'styled-components';
import { FaTrash, FaPencilAlt, FaCheckCircle } from 'react-icons/fa'; // <--- FIX: Added FaCheckCircle
import EditModal from '../components/common/EditModal';
import CompletedTasksModal from '../components/common/CompletedTasksModal'; // <--- FIX: Added import
import FollowUpTaskModal from '../components/common/FollowUpTaskModal';
import { formatTimeSpent } from '../utils/timeFormatter'; // <--- FIX: Added import

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

const Select = styled.select`
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    cursor: pointer;
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
const DatePickerWrapper = styled.div`
    .react-datepicker-wrapper { width: 100%; }
    .react-datepicker__input-container input {
        width: 100%; padding: 0.75rem;
        border: 1px solid ${({ theme }) => theme.borderColor};
        border-radius: 8px; background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text}; font-size: 1rem;
    }
`;
const getGlow = (daysLeft) => {
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
    position: relative; background: ${({ theme }) => theme.cardBg};
    border: 1px solid ${({ theme }) => theme.borderColor}; padding: 1.5rem;
    border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
    text-align: center;
    box-shadow: ${({ daysLeft }) => getGlow(daysLeft)};
    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ daysLeft }) => getGlow(daysLeft).replace('0.1', '0.2')};
    }
`;
const CardActions = styled.div`
    position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.25rem;
`;
const ActionButton = styled.button`
    background: none; border: none; color: ${({ theme }) => theme.text}60;
    cursor: pointer; font-size: 0.9rem; padding: 0.5rem; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
    &:hover {
        background: ${({ hoverBg }) => hoverBg || '#ef44441a'};
        color: ${({ hoverColor }) => hoverColor || '#ef4444'};
    }
`;
const BottomRightButton = styled(ActionButton)`
    position: absolute; bottom: 0.5rem; right: 0.5rem; top: unset;
`;
const ViewCompletedButton = styled(SubmitButton)`
    background: transparent;
    color: ${({ theme }) => theme.accent};
    border: 1px solid ${({ theme }) => theme.accent};
    margin-top: 1rem;
`;
const TaskName = styled.h3` margin: 0 0 0.25rem 0; color: ${({ theme }) => theme.text}; `;
const TaskDue = styled.p` margin: 0; color: ${({ theme }) => theme.text}99; font-weight: 500; font-size: 0.9rem; `;
const TimeSpentDisplay = styled(TaskDue)` font-style: italic; margin-top: 0.5rem; `; // <--- FIX: Added definition

const MilestoneIndicator = styled.div`
    display: inline-block;
    background-color: ${({ color }) => color || 'transparent'};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
    border: 2px solid ${({ color }) => color || 'transparent'};
`;

const TaskMilestone = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.text}80;
`;

const ImminentTasks = () => {
    const { tasks, milestones, addTask, removeTask, updateTask, toggleTaskCompletion, getMilestoneById } = useAppContext();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [approach, setApproach] = useState('');
    const [selectedMilestoneId, setSelectedMilestoneId] = useState('');
    const approachRef = useRef(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isCompletedModalOpen, setCompletedModalOpen] = useState(false);
    const [isFollowUpModalOpen, setFollowUpModalOpen] = useState(false);
    const [completedTask, setCompletedTask] = useState(null);

    const { incompleteTasks, completedTasks } = useMemo(() => {
        const incomplete = tasks.filter(t => !t.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const complete = tasks.filter(t => t.completed).sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        return { incompleteTasks: incomplete, completedTasks: complete };
    }, [tasks]);

    const handleSubmit = (e) => { e.preventDefault(); if (!name.trim()) return; addTask({ name, dueDate: dueDate.toISOString(), description: approach, priority: 'medium', milestoneId: selectedMilestoneId || null }); setName(''); setApproach(''); setSelectedMilestoneId(''); };
    const handleTaskClick = (taskId) => { if(window.confirm("Start this task now? This will take you to the immersive zone.")) { navigate(`/immersive/${taskId}`); } };
    const handleRemoveTask = (e, taskId) => { e.stopPropagation(); if (window.confirm("Are you sure you want to delete this task?")) { removeTask(taskId); }};
    const handleOpenEditModal = (e, task) => { e.stopPropagation(); setEditingTask(task); setEditModalOpen(true); };
    const handleSaveTask = (updatedData) => { if (editingTask) { updateTask(editingTask.id, updatedData); } };
    const handleToggleComplete = async (e, taskId) => { 
        e.stopPropagation(); 
        const task = tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            // Task is being completed, show follow-up modal
            setCompletedTask(task);
            setFollowUpModalOpen(true);
        }
        await toggleTaskCompletion(taskId); 
    };

    // FIX: Restored auto-bullet functionality
    const handleApproachChange = (e) => { let value = e.target.value; if (value === '') { setApproach(''); return; } if (!value.startsWith('• ')) { value = '• ' + value.trimStart(); } setApproach(value); };
    const handleApproachKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); const { value, selectionStart } = e.target; const newValue = value.substring(0, selectionStart) + '\n• ' + value.substring(selectionStart); setApproach(newValue); requestAnimationFrame(() => { if (approachRef.current) { const newCursorPosition = selectionStart + 3; approachRef.current.selectionStart = newCursorPosition; approachRef.current.selectionEnd = newCursorPosition; } }); } };

    return (
        <TasksContainer>
            <Title>Imminent Tasks</Title>
            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Add New Task</FormTitle>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Task Name" required />
                <DatePickerWrapper>
                    <DatePicker selected={dueDate} onChange={date => setDueDate(date)} dateFormat="MMMM d, yyyy" />
                </DatePickerWrapper>
                <Select value={selectedMilestoneId} onChange={e => setSelectedMilestoneId(e.target.value)}>
                    <option value="">No milestone (optional)</option>
                    {milestones.map(milestone => (
                        <option key={milestone.id} value={milestone.id}>
                            {milestone.name}
                        </option>
                    ))}
                </Select>
                <TextArea ref={approachRef} value={approach} onChange={handleApproachChange} onKeyDown={handleApproachKeyDown} placeholder="Method of approach (bullet points)" />
                <SubmitButton type="submit">Add Task</SubmitButton>
            </FormContainer>
            <ViewCompletedButton onClick={() => setCompletedModalOpen(true)}>
                View Completed Tasks ({completedTasks.length})
            </ViewCompletedButton>
            <TasksList>
                {incompleteTasks.map(task => {
                    const daysLeft = differenceInDays(new Date(task.dueDate), new Date());
                    const milestone = task.milestoneId ? getMilestoneById(task.milestoneId) : null;
                    return (
                        <TaskCard key={task.id} onClick={() => handleTaskClick(task.id)} daysLeft={daysLeft}>
                            <CardActions>
                                <ActionButton onClick={(e) => handleOpenEditModal(e, task)} hoverColor="#6366f1" hoverBg="#6366f11a"><FaPencilAlt /></ActionButton>
                                <ActionButton onClick={(e) => handleRemoveTask(e, task.id)}><FaTrash /></ActionButton>
                            </CardActions>
                            <TaskName>{task.name}</TaskName>
                            <TaskDue>{daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} days` : `Due in: ${daysLeft} days`}</TaskDue>
                            <TimeSpentDisplay>Time Spent: {formatTimeSpent(task.timeSpent)}</TimeSpentDisplay>
                            {milestone && (
                                <TaskMilestone>
                                    <MilestoneIndicator color={milestone.color} />
                                    {milestone.name}
                                </TaskMilestone>
                            )}
                            <BottomRightButton onClick={(e) => handleToggleComplete(e, task.id)} hoverColor="#22c55e" hoverBg="#22c55e1a">
                                <FaCheckCircle />
                            </BottomRightButton>
                        </TaskCard>
                    );
                })}
            </TasksList>
            <EditModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} item={editingTask} onSave={handleSaveTask} />
            <CompletedTasksModal isOpen={isCompletedModalOpen} onClose={() => setCompletedModalOpen(false)} tasks={completedTasks} />
            <FollowUpTaskModal 
                isOpen={isFollowUpModalOpen} 
                onClose={() => setFollowUpModalOpen(false)} 
                completedTask={completedTask} 
            />
        </TasksContainer>
    );
};

export default ImminentTasks;