import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Navbar';
import AccountService from '../../account_service';

import './AccountProfile.css'

// TODO: to save into a PUT: /users/:id API. Update only necessary fields
const AccountProfile = ({ userId }) => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    user_name: '',
    first_name: '',
    last_name: '',
    roles: [],
    projects: [],
    profile_photo: '' // TODO: need to add upload capability
  });

  // API calls here
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`);
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call the update profile api here
    setEditMode(false);
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  return (
    <div>
      <Navbar />
      <Container className="container-fluid account-profile mt-4">
        <Row>
          <Col md={6} style={{ borderRight: '1px solid #ccc' }} className="d-flex flex-column align-items-center">
            <div className="profile-photo-container">
              {userData.profile_photo ? (
                <Image src={userData.profile_photo} alt="Profile" fluid roundedCircle style={{ width: '200px', height: '200px' }} />
              ) : (
                <FontAwesomeIcon icon={faUser} size="6x" className="profile-icon" />
              )}
            </div>
            <Button onClick={handleEditModeToggle} variant="primary" className="mt-3">Edit Profile</Button>
          </Col>
          <Col md={6} style={{ borderLeft: '1px solid #ccc' }}>
            {editMode ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="formUserName">
                  <Form.Label column sm={2}>User Name</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      name="user_name"
                      value={userData.user_name}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formFirstName">
                  <Form.Label column sm={2}>First Name</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={userData.first_name}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formLastName">
                  <Form.Label column sm={2}>Last Name</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={userData.last_name}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>
                <Button variant="primary" type="submit">Save</Button>
              </Form>
            ) : (
              <div className='container'>
                <div className="mb-3">
                  <Form.Label><strong>User Name</strong></Form.Label>
                  <Form.Control plaintext readOnly defaultValue={userData.user_name} />
                </div>
                <div className="mb-3">
                  <Form.Label><strong>First Name</strong></Form.Label>
                  <Form.Control plaintext readOnly defaultValue={userData.first_name} />
                </div>
                <div className="mb-3">
                  <Form.Label><strong>Last Name</strong></Form.Label>
                  <Form.Control plaintext readOnly defaultValue={userData.last_name} />
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AccountService(AccountProfile);
