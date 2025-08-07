import React from 'react';
import styled from 'styled-components';

const ColorPickerContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
`;

const ColorOption = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid ${({ selected, theme }) => selected ? theme.text : 'transparent'};
    background-color: ${({ color }) => color};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        transform: scale(1.1);
        border-color: ${({ theme }) => theme.text}80;
    }
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
`;

const predefinedColors = [
    '#6366f1', // Indigo (default)
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#6b7280', // Gray
    '#1f2937', // Dark Gray
];

const ColorPicker = ({ selectedColor, onColorChange, label = "Color" }) => {
    return (
        <div>
            <Label>{label}</Label>
            <ColorPickerContainer>
                {predefinedColors.map((color) => (
                    <ColorOption
                        key={color}
                        type="button"
                        color={color}
                        selected={selectedColor === color}
                        onClick={() => onColorChange(color)}
                        title={color}
                    />
                ))}
            </ColorPickerContainer>
        </div>
    );
};

export default ColorPicker;