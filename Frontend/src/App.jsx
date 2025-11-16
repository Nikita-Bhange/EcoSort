import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import LoginForm from './Pages/LoginForm'


function App() {
  

  return (
    <>
    
  
      <Routes>
        {/* Default route shows Login */}
        <Route path="/" element={<Navigate to="/LoginForm" />} />

        {/* Login and SignUp routes */}
        <Route path="/loginform" element={<LoginForm />} />

        <Route path="/home" element={ <Home /> }/>

       
      </Routes>
 
      
    </>
  )
}

export default App
