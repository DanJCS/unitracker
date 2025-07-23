// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppProvider, useAppContext } from './context/AppContext';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import ImminentTasks from './pages/ImminentTasks';
import Milestones from './pages/Milestones';
import ImmersiveZone from './pages/ImmersiveZone';

function AppContent() {
    const { theme } = useAppContext();
    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

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
        <AppProvider>
            <Router>
                <AppContent />
            </Router>
        </AppProvider>
    );
}

export default App;