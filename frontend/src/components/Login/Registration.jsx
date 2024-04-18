import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import axios from '../../axios_interceptor';
import { toast } from 'react-toastify';

const UserRegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

   const clearForm =() =>{
    setFormData({
      user_name: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: ''
    });
   };

   const handleSubmit = async e => {
    e.preventDefault();
    try {
      let response = await axios.post(`${BASE_URL}/users/registration`, formData);

      if (response.status === 200 || response.status === 201) {
        toast.success(`You have registered successfully.`);
        clearForm();

      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response ? error.response.data.message : error.message, { autoClose: 700 });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registration</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUserName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid">Please provide a username.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid">Please provide a password.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid">Please confirm your password.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid">Please provide a first name.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            autoComplete="off"
          />
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center"> 
          <Button variant="primary" type="submit" size="md">
            Register
          </Button>
          <Link to="/login" className="btn btn-link">Back to login</Link>
        </div>
      </Form>
    </div>
  );
};

export default UserRegistrationForm;
