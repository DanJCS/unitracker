import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppProvider, useAppContext } from './context/AppContext';
import { lightTheme, darkTheme, immersiveTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import ImminentTasks from './pages/ImminentTasks';
import Milestones from './pages/Milestones';
import ImmersiveZone from './pages/ImmersiveZone';

function App() {
    const { theme } = useAppContext();
    // The Immersive Zone gets its own special theme
    const currentTheme = window.location.pathname.startsWith('/immersive')
        ? immersiveTheme
        : theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={currentTheme}>
            <GlobalStyle />
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Overview />} />
                        <Route path="tasks" element={<ImminentTasks />} />
                        <Route path="milestones" element={<Milestones />} />
                    </Route>
                    <Route path="/immersive/:taskId" element={<ImmersiveZone />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

// Wrap App in the provider
const AppWrapper = () => (
    <AppProvider>
        <App />
    </AppProvider>
);

export default AppWrapper;