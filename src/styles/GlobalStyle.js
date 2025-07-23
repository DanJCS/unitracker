// src/styles/GlobalStyle.js

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    /* Modern CSS Reset */
    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }

    body {
        min-height: 100vh;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        transition: background 0.25s linear, color 0.25s linear;
    }

    #root {
        min-height: 100vh;
        isolation: isolate; /* Create a new stacking context */
    }

    /* Basic styles for common elements */
    h1, h2, h3, h4, h5, h6 {
        text-wrap: balance; /* Improves heading wrapping */
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        font-family: inherit;
    }
    
    .date-picker-full-width {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid ${({ theme }) => theme.borderColor};
        border-radius: 8px;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        font-size: 1rem;
    }
`;