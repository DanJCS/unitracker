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
    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    // The logic to force the immersive theme is no longer needed here,
    // as the page will now inherit the globally selected theme.
    // We've simplified the `currentTheme` selection.

    return (
        <ThemeProvider theme={currentTheme}>
            <GlobalStyle />
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Overview />} />
                        <Route path="tasks" element={<ImminentTasks />} />
                        <Route path="milestones" element={<Milestones />} />
                        {/* The immersive route is now a child of Layout */}
                        <Route path="immersive/:taskId" element={<ImmersiveZone />} />
                    </Route>
                    {/* This standalone route is no longer needed */}
                    {/* <Route path="/immersive/:taskId" element={<ImmersiveZone />} /> */}
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