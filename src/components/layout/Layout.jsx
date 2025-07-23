import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';

/*---------------------------------
  Root grid
  – sidebar (auto) + main (1fr)
---------------------------------*/
const AppContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    height: 100vh;
`;

/*---------------------------------
  Scrollable center column
---------------------------------*/
const ContentWrapper = styled.main`
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;     /* keeps content at the top */
    padding: 3rem 2rem;
`;

/*---------------------------------
  Constrained content block
---------------------------------*/
const PageContent = styled.div`
    width: 100%;
    max-width: 1100px;
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
                <PageContent>
                    <Outlet />
                </PageContent>
            </ContentWrapper>
        </AppContainer>
    );
};

export default Layout;