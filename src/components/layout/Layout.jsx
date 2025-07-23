import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import MobileMenuButton from './MobileMenuButton';

const AppContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.body};
`;

const ContentWrapper = styled.main`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 2rem;
    margin-left: ${({ sidebarWidth }) => sidebarWidth}px;
    transition: margin-left 0.3s ease;

    @media (max-width: 768px) {
        margin-left: 0;
        padding: 1rem;
    }
`;

// --- MODIFIED CODE START ---
const PageContent = styled.div`
    width: 100%;
    max-width: 800px; /* This sets the content width */
    /* By removing text-align and align-items, the container is centered, */
    /* but the content inside flows naturally (e.g., text is left-aligned). */
`;
// --- MODIFIED CODE END ---

const Layout = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const sidebarWidth = isSidebarCollapsed ? 80 : 250;

    return (
        <AppContainer>
            <MobileMenuButton onClick={() => setSidebarCollapsed(false)} />
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />
            <ContentWrapper sidebarWidth={sidebarWidth}>
                <PageContent>
                    <Outlet />
                </PageContent>
            </ContentWrapper>
        </AppContainer>
    );
};

export default Layout;