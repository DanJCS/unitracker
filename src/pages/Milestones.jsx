// src/pages/Milestones.jsx

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import { format, differenceInDays } from 'date-fns';
import { FaTrash, FaPencilAlt, FaCheck, FaUndo } from 'react-icons/fa';
import EditModal from '../components/common/EditModal';
import DescriptionModal from '../components/common/DescriptionModal';

const MilestonesContainer = styled.div`
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

const MilestonesList = styled.div`
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const getGlow = (daysLeft) => {
    const baseShadow = `0 2px 8px rgba(0,0,0,0.1)`;
    if (daysLeft < 0) return baseShadow;
    let glowColor;
    if (daysLeft === 0) glowColor = '#ef4444';
    else if (daysLeft === 1) glowColor = '#f97316';
    else if (daysLeft <= 5) glowColor = '#eab308';
    else return baseShadow;
    return `0 0 12px 2px ${glowColor}60, ${baseShadow}`;
};

const MilestoneCard = styled.div`
    position: relative; display: flex; justify-content: space-between; align-items: center;
    background: ${({ theme }) => theme.cardBg}; padding: 1.5rem; border-radius: 12px;
    border-left: 5px solid ${({ completed, theme }) => (completed ? '#22c55e' : '#EF4444')};
    transition: all 0.2s ease;
    box-shadow: ${({ daysLeft }) => getGlow(daysLeft)};
    min-height: 100px;
    cursor: pointer; // Make the whole card clickable
    &:hover { transform: translateY(-2px); }
    @media (max-width: 768px) {
        flex-direction: column; gap: 1rem; text-align: center;
        padding-bottom: 5rem;
    }
`;

const CardActions = styled.div`
    position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.25rem;
`;

const ActionButton = styled.button`
    background: none; border: none; color: ${({ theme }) => theme.text}60;
    cursor: pointer; font-size: 0.9rem; padding: 0.5rem; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
    &:hover { background: ${({ hoverBg }) => hoverBg || '#ef44441a'}; color: ${({ hoverColor }) => hoverColor || '#ef4444'}; }
`;

const MilestoneInfo = styled.div`
    flex: 1;
    padding-right: 1rem;
    // On mobile, ensure info is centered when stacked
    @media (max-width: 768px) { padding-right: 0; }
`;

const MilestoneName = styled.strong`
    color: ${({ theme }) => theme.text};
    font-size: 1.1rem;
`;

const MilestoneDate = styled.span`
    color: ${({ theme }) => theme.text}99;
    margin-left: 0.5rem;
`;

const CompleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 9999px; // Pill shape
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    color: white;
    transition: all 0.2s ease;

    // Conditional styling based on the 'completed' prop
    background-color: ${({ completed, theme }) => (completed ? '#22c55e' : theme.accent)};

    &:hover {
        opacity: 0.85;
    }

    // Mobile layout from your request
    @media (max-width: 768px) {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 3rem);
    }
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

const Milestones = () => {
    const { milestones, addMilestone, toggleMilestoneCompletion, removeMilestone, updateMilestone } = useAppContext();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addMilestone({ name, date: date.toISOString(), description });
        setName('');
        setDescription('');
    };
    const handleRemoveMilestone = (e, milestoneId) => { e.stopPropagation(); if (window.confirm("Are you sure you want to delete this milestone?")) { removeMilestone(milestoneId); }};
    const handleOpenEditModal = (e, milestone) => { e.stopPropagation(); setEditingMilestone(milestone); setEditModalOpen(true); };
    const handleSaveMilestone = (updatedData) => { if (editingMilestone) { updateMilestone(editingMilestone.id, updatedData); } };
    const handleToggleCompletion = (e, id) => { e.stopPropagation(); toggleMilestoneCompletion(id); };
    const handleOpenDescriptionModal = (milestone) => { setSelectedMilestone(milestone); setDescriptionModalOpen(true); };

    return (
        <MilestonesContainer>
            <Title>Manage Milestones</Title>
            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Add New Milestone</FormTitle>
                <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Milestone Name (e.g., Final Report Due)" required />
                <DatePickerWrapper><DatePicker selected={date} onChange={d => setDate(d)} dateFormat="MMMM d, yyyy" /></DatePickerWrapper>
                <TextArea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a description... (supports Markdown)" />
                <SubmitButton type="submit">Add Milestone</SubmitButton>
            </FormContainer>
            <MilestonesList>
                {milestones.sort((a, b) => new Date(a.date) - new Date(b.date)).map(m => {
                    const daysLeft = differenceInDays(new Date(m.date), new Date());
                    return (
                        <MilestoneCard key={m.id} completed={m.completed} daysLeft={daysLeft} onClick={() => handleOpenDescriptionModal(m)}>
                            <CardActions>
                                <ActionButton onClick={(e) => handleOpenEditModal(e, m)} hoverColor="#6366f1" hoverBg="#6366f11a"><FaPencilAlt /></ActionButton>
                                <ActionButton onClick={(e) => handleRemoveMilestone(e, m.id)}><FaTrash /></ActionButton>
                            </CardActions>
                            <MilestoneInfo>
                                <MilestoneName>{m.name}</MilestoneName>
                                <MilestoneDate>- {format(new Date(m.date), 'do MMMM yyyy')}</MilestoneDate>
                            </MilestoneInfo>
                            <CompleteButton completed={m.completed} onClick={(e) => handleToggleCompletion(e, m.id)}>
                                {m.completed ? <FaUndo /> : <FaCheck />}
                                {m.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                            </CompleteButton>
                        </MilestoneCard>
                    )
                })}
            </MilestonesList>
            <EditModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} item={editingMilestone} onSave={handleSaveMilestone} />
            <DescriptionModal isOpen={isDescriptionModalOpen} onClose={() => setDescriptionModalOpen(false)} milestone={selectedMilestone} />
        </MilestonesContainer>
    );
}
export default Milestones;