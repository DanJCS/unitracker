// src/components/common/SettingsModal.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContextFallback';
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
    max-width: 450px;
    color: ${({ theme }) => theme.text};
`;

const ModalTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
`;

const Button = styled.button`
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: 1px solid ${({ theme, primary }) => (primary ? theme.accent : theme.borderColor)};
    background: ${({ theme, primary }) => (primary ? theme.accent : 'transparent')};
    color: ${({ theme, primary }) => (primary ? 'white' : theme.text)};
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.85; }
`;

const SettingsModal = ({ isOpen, onClose }) => {
    const context = useAppContext();
    const { semesterStart, semesterEnd, setSemesterDates } = context || {};
    const [startDate, setStartDate] = useState(semesterStart);
    const [endDate, setEndDate] = useState(semesterEnd);

    if (!isOpen) return null;

    const handleSave = () => {
        setSemesterDates(startDate, endDate);
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>Settings</ModalTitle>
                <FormGroup>
                    <label htmlFor="start-date">Semester Start Date</label>
                    <DatePicker
                        id="start-date"
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="MMMM d, yyyy"
                        className="date-picker-full-width"
                    />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="end-date">Semester End Date</label>
                    <DatePicker
                        id="end-date"
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="MMMM d, yyyy"
                        className="date-picker-full-width"
                    />
                </FormGroup>
                <ButtonGroup>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} primary>Save Changes</Button>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

// Add this CSS to GlobalStyle or a relevant CSS file to style the date picker input
// In src/styles/GlobalStyle.js, add:
/*
.date-picker-full-width {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 8px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
}
*/
// For now, let's just add it to GlobalStyle.js
export default SettingsModal;