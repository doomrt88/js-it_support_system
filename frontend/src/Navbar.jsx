import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">ITSM</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/boards">Boards</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create">Create</Link>
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
              <li>
                <a className="dropdown-item" href="#">Account</a>
              </li>
              <Link className="dropdown-item" to="/login" onClick={handleLogout}>Logout</Link>
            </ul>
          </li>
        </div>


      </nav>
  );
};

export default Navbar;
