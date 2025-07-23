import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { FaHome, FaTasks, FaFlag, FaMoon, FaSun, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SidebarContainer = styled.div`
    width: ${({ isCollapsed }) => (isCollapsed ? '80px' : '250px')};
    height: 100vh;
    background: ${({ theme }) => theme.sidebarBg};
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    transition: width 0.3s ease;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    z-index: 1000;

    @media (max-width: 768px) {
        transform: translateX(${({ isCollapsed }) => isCollapsed ? '-100%' : '0'});
        width: 250px;
    }
`;

const NavItem = styled(NavLink)`
    display: flex;
    align-items: center;
    padding: 1rem;
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${({ theme }) => theme.accent}10;
    }
    
    &.active {
        background: ${({ theme }) => theme.accent}1A;
        color: ${({ theme }) => theme.accent};
        border-right: 3px solid ${({ theme }) => theme.accent};
    }
`;

const Icon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 1.2rem;
`;

const Label = styled.span`
    margin-left: 1rem;
    font-weight: 500;
    opacity: ${({ isCollapsed }) => isCollapsed ? 0 : 1};
    transition: opacity 0.3s ease;
`;

const Toggler = styled.button`
    position: absolute;
    top: 1rem;
    right: -15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: ${({ theme }) => theme.accent};
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 1001;

    @media (max-width: 768px) {
        display: none;
    }
`;

const ThemeToggle = styled.button`
    margin: auto 1rem 1rem 1rem;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    background: transparent;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        background: ${({ theme }) => theme.accent}10;
    }
`;

const MobileOverlay = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: ${({ show }) => show ? 'block' : 'none'};
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    }
`;

const Sidebar = ({ isCollapsed, setCollapsed }) => {
    const { theme, toggleTheme } = useAppContext();

    return (
        <>
            <MobileOverlay show={!isCollapsed} onClick={() => setCollapsed(true)} />
            <SidebarContainer isCollapsed={isCollapsed}>
                <Toggler onClick={() => setCollapsed(!isCollapsed)}>
                    {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </Toggler>

                <NavItem to="/">
                    <Icon><FaHome /></Icon>
                    {!isCollapsed && <Label>Overview</Label>}
                </NavItem>

                <NavItem to="/tasks">
                    <Icon><FaTasks /></Icon>
                    {!isCollapsed && <Label>Imminent Tasks</Label>}
                </NavItem>

                <NavItem to="/milestones">
                    <Icon><FaFlag /></Icon>
                    {!isCollapsed && <Label>Milestones</Label>}
                </NavItem>

                <ThemeToggle onClick={toggleTheme}>
                    <Icon>{theme === 'light' ? <FaMoon /> : <FaSun />}</Icon>
                    {!isCollapsed && <Label>Toggle Theme</Label>}
                </ThemeToggle>
            </SidebarContainer>
        </>
    );
};

export default Sidebar;