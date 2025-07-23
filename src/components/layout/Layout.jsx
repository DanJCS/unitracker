import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const AppContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 100vh;
`;

const ContentWrapper = styled.main`
    grid-column: 2;
    padding-top: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 3rem;
`;

const Layout = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <AppContainer>
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />
            <ContentWrapper>
                <Outlet />
            </ContentWrapper>
        </AppContainer>
    );
};

export default Layout;