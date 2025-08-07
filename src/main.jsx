import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { signOut } from 'aws-amplify/auth'
import App from './App.jsx'

// Configure Amplify with outputs
const configureAmplify = async () => {
  try {
    const response = await fetch('/amplify_outputs.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch amplify_outputs.json: ${response.status}`)
    }
    const outputs = await response.json()
    Amplify.configure(outputs)
    console.log('✅ Amplify configured successfully')
    
    // Clear any stale authentication state that might cause conflicts
    try {
      await signOut({ global: true })
      console.log('🔄 Cleared any existing authentication state')
    } catch {
      // This is expected if no user is signed in, so we can ignore it
      console.log('ℹ️ No existing authentication state to clear')
    }
  } catch (error) {
    console.error('❌ Failed to configure Amplify:', error)
    throw error
  }
}

// Initialize Amplify before rendering
configureAmplify().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch((error) => {
  console.error('❌ Failed to initialize application:', error)
  // Render a basic error message if Amplify configuration fails
  createRoot(document.getElementById('root')).render(
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h2>Configuration Error</h2>
      <p>Failed to initialize the application. Please check the console for details.</p>
    </div>
  )
})
