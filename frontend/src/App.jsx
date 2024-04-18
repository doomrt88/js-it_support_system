import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './App.css'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import React, { useEffect, useState } from 'react'
import Boards from './components/Boards/Boards'
import Administration from './components/Administration/Administration'
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountProfile from './components/Account/AccountProfile'
import UserRegistrationForm from './components/Login/Registration';

function App() {

  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const [token, setToken] = useState(
    sessionStorage.getItem('token') || localStorage.getItem('token'),
  );

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login setStayLoggedIn={setStayLoggedIn} setEmail={setEmail} />} />
          <Route path="/register" element={<UserRegistrationForm />} />

          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />}/>
          <Route path="/boards" element={token ? <Boards /> : <Navigate to="/login" />}/>
          <Route path="/administration" element={token ? <Administration /> : <Navigate to="/login" />}/>
          <Route path="/account" element={token ? <AccountProfile /> : <Navigate to="/login" />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
