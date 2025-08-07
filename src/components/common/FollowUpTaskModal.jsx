import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContextCloud';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
`;

const ModalContent = styled.div`
    background: ${({ theme }) => theme.cardBg};
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    width: 100%;
    max-width: 500px;
    color: ${({ theme }) => theme.text};
`;

const ModalTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 1rem;
    text-align: center;
    color: ${({ theme }) => theme.accent};
`;

const CompletedTaskInfo = styled.div`
    background: ${({ theme }) => theme.accent}10;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 4px solid ${({ theme }) => theme.accent};
`;

const CompletedTaskName = styled.h3`
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.text};
`;

const MilestoneInfo = styled.p`
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text}80;
    display: flex;
    align-items: center;
`;

const MilestoneIndicator = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
    margin-right: 0.5rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    box-sizing: border-box;
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.accent};
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 80px;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;
    &:focus {
        outline: none;
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
        box-sizing: border-box;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: 1px solid ${({ theme, primary }) => (primary ? theme.accent : theme.borderColor)};
    background: ${({ theme, primary }) => (primary ? theme.accent : 'transparent')};
    color: ${({ theme, primary }) => (primary ? 'white' : theme.text)};
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.85; }
`;

const FollowUpTaskModal = ({ isOpen, onClose, completedTask }) => {
    const { addTask, getMilestoneById } = useAppContext();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default: 1 week from now

    if (!isOpen || !completedTask) return null;

    const milestone = completedTask.milestoneId ? getMilestoneById(completedTask.milestoneId) : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        await addTask({
            name: name.trim(),
            description: description.trim(),
            dueDate: dueDate.toISOString(),
            priority: 'medium',
            milestoneId: completedTask.milestoneId || null
        });

        // Reset form and close
        setName('');
        setDescription('');
        setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        onClose();
    };

    const handleSkip = () => {
        setName('');
        setDescription('');
        setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>🎉 Task Completed!</ModalTitle>
                
                <CompletedTaskInfo>
                    <CompletedTaskName>✅ {completedTask.name}</CompletedTaskName>
                    {milestone && (
                        <MilestoneInfo>
                            <MilestoneIndicator color={milestone.color} />
                            Part of: {milestone.name}
                        </MilestoneInfo>
                    )}
                </CompletedTaskInfo>

                <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    Would you like to create a follow-up task?
                </p>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="followup-name">Task Name</Label>
                        <Input
                            id="followup-name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Next steps or related task..."
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="followup-description">Description (Optional)</Label>
                        <TextArea
                            id="followup-description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Details about this follow-up task..."
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="followup-date">Due Date</Label>
                        <DatePickerWrapper>
                            <DatePicker
                                id="followup-date"
                                selected={dueDate}
                                onChange={date => setDueDate(date)}
                                dateFormat="MMMM d, yyyy"
                                minDate={new Date()}
                            />
                        </DatePickerWrapper>
                    </FormGroup>

                    <ButtonGroup>
                        <Button type="button" onClick={handleSkip}>Skip</Button>
                        <Button type="submit" primary disabled={!name.trim()}>Create Follow-up Task</Button>
                    </ButtonGroup>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};

export default FollowUpTaskModal;