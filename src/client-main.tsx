import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ClientChatAssistant } from './components/ClientChatAssistant'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientChatAssistant onDiagnosticSubmitted={() => {}} />
  </StrictMode>,
)
