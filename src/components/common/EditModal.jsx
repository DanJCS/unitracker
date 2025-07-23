// src/components/common/EditModal.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Reusing styles from SettingsModal for consistency
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
    justify-content: center; z-index: 2000;
`;
const ModalContent = styled.div`
    background: ${({ theme }) => theme.cardBg}; padding: 2rem;
    border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    width: 100%; max-width: 500px; color: ${({ theme }) => theme.text};
`;
const ModalTitle = styled.h2`
    margin-top: 0; margin-bottom: 1.5rem; text-align: center;
`;
const FormGroup = styled.div`
    margin-bottom: 1.5rem;
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
`;
const Input = styled.input`
    width: 100%; padding: 0.75rem; border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px; background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text}; font-size: 1rem;
`;
const TextArea = styled.textarea`
    width: 100%; min-height: 120px; padding: 0.75rem; border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px; background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text}; font-size: 1rem; resize: vertical;
`;
const ButtonGroup = styled.div`
    display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;
`;
const Button = styled.button`
    padding: 0.6rem 1.2rem; border-radius: 8px;
    border: 1px solid ${({ theme, primary }) => (primary ? theme.accent : theme.borderColor)};
    background: ${({ theme, primary }) => (primary ? theme.accent : 'transparent')};
    color: ${({ theme, primary }) => (primary ? 'white' : theme.text)};
    font-weight: 600; cursor: pointer; transition: opacity 0.2s ease;
    &:hover { opacity: 0.85; }
`;

const EditModal = ({ isOpen, onClose, item, onSave }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [approach, setApproach] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.name || '');
            // Handle both `dueDate` (for tasks) and `date` (for milestones)
            setDate(new Date(item.dueDate || item.date));
            // The approach field only exists for tasks
            if (item.approach !== undefined) {
                setApproach(item.approach);
            }
        }
    }, [item]);

    if (!isOpen) return null;

    const handleSave = () => {
        const updatedData = { name, date: date.toISOString() };
        // Use 'dueDate' for tasks to match the data structure
        if (item.dueDate) {
            updatedData.dueDate = updatedData.date;
        }
        if (item.approach !== undefined) {
            updatedData.approach = approach;
        }
        onSave(updatedData);
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>Edit {item.dueDate ? 'Task' : 'Milestone'}</ModalTitle>
                <FormGroup>
                    <label>Name</label>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <label>Date</label>
                    <DatePicker selected={date} onChange={d => setDate(d)} className="date-picker-full-width" />
                </FormGroup>
                {item.approach !== undefined && (
                    <FormGroup>
                        <label>Method of Approach</label>
                        <TextArea value={approach} onChange={e => setApproach(e.target.value)} />
                    </FormGroup>
                )}
                <ButtonGroup>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} primary>Save</Button>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EditModal;