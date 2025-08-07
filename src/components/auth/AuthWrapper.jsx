import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ThemeProvider } from 'styled-components';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { useAppContext } from '../../context/AppContextAmplify';
import { lightTheme, darkTheme } from '../../styles/theme';

const AuthWrapper = ({ children }) => {
  const { theme } = useAppContext();
  const [authError, setAuthError] = useState(null);
  const [isHandlingAuthError, setIsHandlingAuthError] = useState(false);
  
  useEffect(() => {
    // Check for existing authentication state issues on mount
    const checkAuthState = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        if (error.name === 'UserUnAuthenticatedException') {
          // User is not authenticated, this is normal
          return;
        }
        console.warn('Authentication state issue detected:', error);
      }
    };
    
    checkAuthState();
  }, []);

  const handleAuthError = async (error) => {
    console.error('Authentication error:', error);
    
    if (error.name === 'UserAlreadyAuthenticatedException') {
      setAuthError('There was an authentication conflict. Clearing session...');
      setIsHandlingAuthError(true);
      
      try {
        // Force sign out to clear the conflicted state
        await signOut({ global: true });
        setAuthError('Session cleared. Please sign in again.');
        
        // Clear the error after a few seconds
        setTimeout(() => {
          setAuthError(null);
          setIsHandlingAuthError(false);
        }, 3000);
      } catch (signOutError) {
        console.error('Error during forced sign out:', signOutError);
        setAuthError('Authentication error. Please refresh the page.');
        setIsHandlingAuthError(false);
      }
    } else {
      setAuthError('Authentication error occurred. Please try again.');
      setTimeout(() => setAuthError(null), 5000);
    }
  };
  
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

  const ErrorMessage = () => (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: theme === 'dark' ? '#dc3545' : '#f8d7da',
      color: theme === 'dark' ? '#ffffff' : '#721c24',
      padding: '12px 20px',
      borderRadius: '6px',
      border: `1px solid ${theme === 'dark' ? '#dc3545' : '#f5c6cb'}`,
      zIndex: 10000,
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }}>
      {authError}
    </div>
  );

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      {authError && <ErrorMessage />}
      <Authenticator 
        theme={amplifyTheme} 
        variation="modal"
        onError={handleAuthError}
      >
        {() => (
          <div>
            {isHandlingAuthError ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '16px',
                color: theme === 'dark' ? '#ffffff' : '#333333'
              }}>
                Resolving authentication issue...
              </div>
            ) : (
              children
            )}
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
};

export default AuthWrapper;