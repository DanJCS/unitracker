import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ThemeProvider } from 'styled-components';
import { useAppContext } from '../../context/AppContextAmplify';
import { lightTheme, darkTheme } from '../../styles/theme';

const AuthWrapper = ({ children }) => {
  const { theme } = useAppContext();
  
  const amplifyTheme = {
    name: 'unitracker-theme',
    tokens: {
      colors: {
        brand: {
          primary: {
            10: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
            20: theme === 'dark' ? '#2d2d2d' : '#e9ecef',
            40: theme === 'dark' ? '#404040' : '#ced4da',
            60: theme === 'dark' ? '#666666' : '#6c757d',
            80: theme === 'dark' ? '#999999' : '#495057',
            90: theme === 'dark' ? '#cccccc' : '#343a40',
            100: theme === 'dark' ? '#ffffff' : '#212529',
          }
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <Authenticator theme={amplifyTheme} variation="modal">
        {() => (
          <div>
            {children}
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
};

export default AuthWrapper;