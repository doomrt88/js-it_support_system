import React, { useState, useEffect } from 'react';
import axios from '../../../axios_interceptor'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const UserDialog = ({ onSubmit, onCancel, userFormDetails }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [formData, setFormData] = useState({
    user_name: userFormDetails ? userFormDetails.user_name : '',
    password: userFormDetails ? userFormDetails.password : '',
    first_name: userFormDetails ? userFormDetails.first_name : '',
    last_name: userFormDetails ? userFormDetails.last_name : ''
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/roles`);
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchRoles();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (userFormDetails) {
      setFormData({
        user_name: userFormDetails.user_name || '',
        password: userFormDetails.password || '',
        first_name: userFormDetails.first_name || '',
        last_name: userFormDetails.last_name || ''
      });
      setSelectedRoles(userFormDetails.roles);
      setSelectedProjects(userFormDetails.projects);
    }
  }, [userFormDetails]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      roles: selectedRoles,
      projects: selectedProjects
    };
    onSubmit(updatedFormData);
  };

  const handleClose = () => {
    onCancel();
  };

  const handleRoleToggle = (roleName) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter(role => role !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const handleProjectToggle = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} keyboard={false} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          <Form.Group className="mb-3" controlId="formRoles">
            <Form.Label>Roles</Form.Label>
            <div>
              {roles.map(role => (
                <Form.Check
                  key={role._id}
                  type="checkbox"
                  id={`role-${role._id}`}
                  label={role.name}
                  checked={selectedRoles.includes(role.name)}
                  onChange={() => handleRoleToggle(role.name)}
                />
              ))}
            </div>
            <Form.Control.Feedback type="invalid">Please select at least one role.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProjects">
            <Form.Label>Projects</Form.Label>
            <div>
              {projects.map(project => (
                <Form.Check
                  key={project._id}
                  type="checkbox"
                  id={`project-${project._id}`}
                  label={project.name}
                  checked={selectedProjects.includes(project._id)}
                  onChange={() => handleProjectToggle(project._id)}
                />
              ))}
            </div>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} size="md">
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="md">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserDialog;
