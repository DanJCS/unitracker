import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import { format } from 'date-fns';

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

const MilestoneCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${({ theme }) => theme.cardBg};
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 5px solid ${({ completed, theme }) => (completed ? '#3B82F6' : '#EF4444')};
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
`;

const MilestoneInfo = styled.div`
    flex: 1;
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
    padding: 0.5rem 1rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    cursor: pointer;
    background: transparent;
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${({ theme }) => theme.accent}10;
        border-color: ${({ theme }) => theme.accent};
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

const Milestones = () => {
    const { milestones, addMilestone, toggleMilestoneCompletion } = useAppContext();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addMilestone({ name, date: date.toISOString().split('T')[0] });
        setName('');
    };

    return (
        <MilestonesContainer>
            <Title>Manage Milestones</Title>

            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Add New Milestone</FormTitle>
                <Input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Milestone Name (e.g., Final Report Due)"
                    required
                />
                <DatePickerWrapper>
                    <DatePicker
                        selected={date}
                        onChange={d => setDate(d)}
                        dateFormat="MMMM d, yyyy"
                    />
                </DatePickerWrapper>
                <SubmitButton type="submit">Add Milestone</SubmitButton>
            </FormContainer>

            <MilestonesList>
                {milestones
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(m => (
                        <MilestoneCard key={m.id} completed={m.completed}>
                            <MilestoneInfo>
                                <MilestoneName>{m.name}</MilestoneName>
                                <MilestoneDate>- {format(new Date(m.date), 'do MMMM yyyy')}</MilestoneDate>
                            </MilestoneInfo>
                            <CompleteButton onClick={() => toggleMilestoneCompletion(m.id)}>
                                {m.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                            </CompleteButton>
                        </MilestoneCard>
                    ))}
            </MilestonesList>
        </MilestonesContainer>
    );
}

export default Milestones;