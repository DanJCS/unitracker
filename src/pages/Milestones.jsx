import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import { format } from 'date-fns';

// NEW: Reusable styled-components for the form and list
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormContainer = styled.form`
  background: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  input {
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  .react-datepicker-wrapper input {
    width: 100%;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background: ${({ theme }) => theme.accent};
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const MilestoneList = styled.div`
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
  border-radius: 8px;
  border-left: 5px solid ${({ completed, theme }) => (completed ? '#3B82F6' : '#EF4444')};
`;

const CompleteButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    color: ${({ theme }) => theme.text};
`;

const Milestones = () => {
    const { milestones, addMilestone, toggleMilestoneCompletion } = useAppContext();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return; // Prevent adding empty milestones
        addMilestone({ name, date: date.toISOString().split('T')[0] }); // Format as YYYY-MM-DD
        setName('');
    };

    return (
        <PageContainer>
            <h1>Manage Milestones</h1>

            {/* NEW: Add Milestone Form */}
            <FormContainer onSubmit={handleSubmit}>
                <h2>Add New Milestone</h2>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Milestone Name (e.g., Final Report Due)"
                    required
                />
                <DatePicker
                    selected={date}
                    onChange={d => setDate(d)}
                    dateFormat="MMMM d, yyyy"
                />
                <SubmitButton type="submit">Add Milestone</SubmitButton>
            </FormContainer>

            {/* UPDATED: List of milestones */}
            <MilestoneList>
                {milestones
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(m => (
                        <MilestoneCard key={m.id} completed={m.completed}>
                            <div>
                                <strong>{m.name}</strong> - {format(new Date(m.date), 'do MMMM yyyy')}
                            </div>
                            <CompleteButton onClick={() => toggleMilestoneCompletion(m.id)}>
                                {m.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                            </CompleteButton>
                        </MilestoneCard>
                    ))}
            </MilestoneList>
        </PageContainer>
    );
}

export default Milestones;