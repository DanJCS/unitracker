// Test Amplify integration step by step
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Amplify Authentication Test</h1>
            
            <Authenticator>
                {({ signOut, user }) => (
                    <div>
                        <h2>✅ Authentication Working!</h2>
                        <p>Welcome, {user?.username || user?.email}!</p>
                        <button onClick={signOut} style={{ 
                            padding: '10px 20px', 
                            margin: '10px 0',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Sign Out
                        </button>
                    </div>
                )}
            </Authenticator>
        </div>
    );
}

export default App;