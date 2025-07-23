import React from 'react';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';

const MenuButton = styled.button`
    display: none;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1002;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    border: none;
    background: ${({ theme }) => theme.accent};
    color: white;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    
    @media (max-width: 768px) {
        display: flex;
    }
`;

const MobileMenuButton = ({ onClick }) => {
    return (
        <MenuButton onClick={onClick}>
            <FaBars />
        </MenuButton>
    );
};

export default MobileMenuButton;