// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// ❌ Убираем импорт ShirtProvider
// import { ShirtProvider } from "./utils/shirtStore";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ❌ Убираем обёртку */}
    <App />
  </StrictMode>,
)