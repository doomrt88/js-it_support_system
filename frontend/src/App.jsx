import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login/Login'
import React, { useEffect, useState } from 'react'

function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
