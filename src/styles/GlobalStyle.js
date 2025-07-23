import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
    line-height: 1.6;
  }
  
  button {
    font-family: 'Inter', sans-serif;
  }
  
  input, textarea {
    font-family: 'Inter', sans-serif;
  }
  
  .react-datepicker {
    font-family: 'Inter', sans-serif;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.cardBg};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .react-datepicker__header {
    background: ${({ theme }) => theme.cardBg};
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  }
  
  .react-datepicker__day--selected {
    background: ${({ theme }) => theme.accent};
    border-radius: 50%;
    &:hover {
      background: ${({ theme }) => theme.accent};
    }
  }
  
  .react-datepicker__day:hover {
    border-radius: 50%;
    background: ${({ theme }) => theme.borderColor};
  }
`;