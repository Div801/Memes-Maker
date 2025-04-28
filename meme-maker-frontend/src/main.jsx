import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MainRoutes from './MainRoutes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainRoutes/>
  </StrictMode>,
)
