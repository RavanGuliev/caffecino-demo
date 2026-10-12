import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './services/i18next.js'
createRoot(document.getElementById('root')).render(
  <App />
)
