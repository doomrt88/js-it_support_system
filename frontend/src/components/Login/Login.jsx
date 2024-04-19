import { useState } from 'react';
import axios from 'axios';
import logo from '../../assets/images/logo.jpg';
import { toast } from 'react-toastify';

const Login = (props) => {
  const [errorMessage, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    stayLoggedIn: false
  });
  
  const { username, password, stayLoggedIn } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password
      });
      if (res.status === 200 || response.status === 201) {
        if (stayLoggedIn) { 
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));

        } else {
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('user', JSON.stringify(res.data.user));
        }

        
        toast.success(res?.data?.user ? 'Welcome ' + res.data.user.userName : 'Welcome');
        setTimeout(() => {
          window.location.replace('/');
        }, 1000);

      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : err.message);
      toast.error(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-lg-3 col-md-6 border p-4">
        <img src={logo} alt="Logo" className="img-fluid mb-4" />
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onChange}
              required
              autoComplete='off'
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group form-check mb-4">
            <input
              type="checkbox"
              id="stayLoggedIn"
              name="stayLoggedIn"
              checked={stayLoggedIn}
              onChange={onChange}
              className="form-check-input"
            />
            <label htmlFor="stayLoggedIn" className="form-check-label">Stay logged in</label>
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
          <div className="text-center mt-4">
            <a className='register-link' href="/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login