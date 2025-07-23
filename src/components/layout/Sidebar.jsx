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
  transition: width 0.3s;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  z-index: 1000;
`;

// ... (Add styled components for NavItem, Icon, Label, etc. - full code below)
// Full code for Sidebar.jsx will be quite long, so I'll provide a summary of the styled components
// you would create: NavItem, Icon, Label, Toggler, ThemeToggle.

// Abridged for brevity, full code would be more extensive:
const NavItem = styled(NavLink)`
  /* styles for nav links */
  display: flex;
  align-items: center;
  padding: 1rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  &.active {
    background: ${({ theme }) => theme.accent}1A; // Faint accent color
    color: ${({ theme }) => theme.accent};
    border-right: 3px solid ${({ theme }) => theme.accent};
  }
`;
const Icon = styled.div` /* styles for icon */`;
const Label = styled.span` /* styles for text label */`;

const Sidebar = ({ isCollapsed, setCollapsed }) => {
    const { theme, toggleTheme } = useAppContext();
    return (
        <SidebarContainer isCollapsed={isCollapsed}>
            {/* ... other components */}
            <NavItem to="/"><Icon><FaHome /></Icon>{!isCollapsed && <Label>Overview</Label>}</NavItem>
            <NavItem to="/tasks"><Icon><FaTasks /></Icon>{!isCollapsed && <Label>Imminent Tasks</Label>}</NavItem>
            <NavItem to="/milestones"><Icon><FaFlag /></Icon>{!isCollapsed && <Label>Milestones</Label>}</NavItem>
            {/* ... Toggler and Theme Toggle buttons */}
        </SidebarContainer>
    );
};

export default Sidebar;