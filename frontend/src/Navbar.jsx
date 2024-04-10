import React, { useState, useEffect } from 'react';
import axios from './axios_interceptor'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import CreateIssueDialog from './components/Issues/CreateIssueDialog';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [issue, setIssue] = useState(null);

    const navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    }

    const handleCreateIssue = () => {
      setShowDialog(true);
      setIssue(null);
    };

    const handleFormSubmit = async (formData) => {
      try {
        const response = await axios.post(`${BASE_URL}/issues`, formData);

        if (response.status === 200 || response.status === 201) {
          toast.success(`Issue has been created successfully.`, { autoClose: 700 });
          handleCloseDialog();
  
        } else {
          throw new Error('Invalid response from server');
        }

        handleCloseDialog();
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.response ? error.response.data.message : error.message);
      }
    };
  
    const handleCloseDialog = () => {
      setShowDialog(false);
      setIssue(null);
    };

    const handleAccount = () =>{
      navigate('/account');
  }
    
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand brand-name" to="/">IT Services</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/boards">Boards</Link>
            </li>
            <li className="nav-item">
              <Button variant="outline-primary" onClick={handleCreateIssue}>Create</Button>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/administration">Administration</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fas fa-user"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <Link className="dropdown-item" to="/account" onClick={handleAccount}>Account</Link>
              <Link className="dropdown-item" to="/login" onClick={handleLogout}>Logout</Link>
            </ul>
          </li>
        </div>

        {showDialog && (
          <CreateIssueDialog onSubmit={handleFormSubmit} onCancel={handleCloseDialog}/>
        )}


      </nav>
  );
};

export default Navbar;
