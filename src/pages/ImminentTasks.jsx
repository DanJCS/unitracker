import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from 'date-fns';
import styled from 'styled-components';

// Styled components for the page, form, task list, etc.
const TaskCard = styled.div`
    background: ${({ theme }) => theme.cardBg};
    border: 1px solid ${({ theme }) => theme.borderColor};
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
        <div>
            <h1>Imminent Tasks</h1>
            {/* Form for adding a new task */}
            <form onSubmit={handleSubmit}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Task Name" />
                <DatePicker selected={dueDate} onChange={date => setDueDate(date)} />
                <textarea value={approach} onChange={e => setApproach(e.target.value)} placeholder="Method of approach (bullet points)"/>
                <button type="submit">Add Task</button>
            </form>

            {/* List of sorted tasks */}
            <div>
                {sortedTasks.map(task => (
                    <TaskCard key={task.id} onClick={() => handleTaskClick(task.id)}>
                        <h3>{task.name}</h3>
                        <p>Due in: {differenceInDays(new Date(task.dueDate), new Date())} days</p>
                    </TaskCard>
                ))}
            </div>
        </div>
    );
};

export default ImminentTasks;