import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import App from './App.jsx'

// Configure Amplify with outputs
const configureAmplify = async () => {
  try {
    const response = await fetch('/amplify_outputs.json')
    const outputs = await response.json()
    Amplify.configure(outputs)
    console.log('✅ Amplify configured successfully')
  } catch (error) {
    console.error('❌ Failed to configure Amplify:', error)
  }
}

configureAmplify()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
