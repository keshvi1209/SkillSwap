import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Loginpage.jsx'
import Signup from './pages/Signuppage.jsx'
import App from './App.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<App />} /> 
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
