import { useState } from 'react';
import axios from 'axios';

const Login = (props) => {
  const [errorMessage, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const { username, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password
      });
      if (res.status === 200) {
        console.log(res.data);
        localStorage.setItem('isLoggedIn', true);
        window.location.replace('/');

      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.msg : err.message);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="col-lg-3 col-md-6 border p-4">
        <h3 className="text-center mb-4">IT Support System</h3>
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
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login