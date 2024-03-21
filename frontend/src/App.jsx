import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import React, { useEffect, useState } from 'react'
import Boards from './components/Boards/Boards'
import Administration from './components/Administration/Administration'

function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  console.log(isLoggedIn);
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />}/>
          <Route path="/boards" element={isLoggedIn ? <Boards /> : <Navigate to="/login" />}/>
          <Route path="/administration" element={isLoggedIn ? <Administration /> : <Navigate to="/login" />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
