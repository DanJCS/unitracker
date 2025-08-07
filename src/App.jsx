// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AppProvider, useAppContext } from './context/AppContextAmplify';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import ImminentTasks from './pages/ImminentTasks';
import Milestones from './pages/Milestones';
import ImmersiveZone from './pages/ImmersiveZone';
import LoadingSpinner from './components/common/LoadingSpinner';

function AppContent() {
    const { theme, isLoading } = useAppContext();
    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    if (isLoading) {
        return (
            <ThemeProvider theme={currentTheme}>
                <GlobalStyle />
                <LoadingSpinner text="Loading your data..." />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={currentTheme}>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Overview />} />
                    <Route path="tasks" element={<ImminentTasks />} />
                    <Route path="milestones" element={<Milestones />} />
                    <Route path="immersive/:taskId" element={<ImmersiveZone />} />
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

function App() {
    return (
        <Authenticator>
            {({ user }) => (
                <AppProvider user={user}>
                    <Router>
                        <AppContent />
                    </Router>
                </AppProvider>
            )}
        </Authenticator>
    );
}

export default App;