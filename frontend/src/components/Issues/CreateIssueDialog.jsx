import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';

const CreateIssueDialog = ({ onSubmit, onCancel, issueFormDetails }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayedUser, setDisplayedUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: issueFormDetails ? issueFormDetails.title : '',
    description: issueFormDetails ? issueFormDetails.description : '',
    priority: issueFormDetails ? issueFormDetails.priority : '',
    start_date: issueFormDetails ? issueFormDetails.start_date : '',
    due_date: issueFormDetails ? issueFormDetails.due_date : '',
    status: issueFormDetails ? issueFormDetails.status : 'New',
    assigned_to: issueFormDetails ? issueFormDetails.assigned_to : '',
    project: issueFormDetails ? issueFormDetails.project : ''
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users?search=${searchTerm}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchProjects();
    if (searchTerm) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (issueFormDetails) {
      const { title, description, priority, start_date, due_date, status, assigned_to } = issueFormDetails;
      setFormData({
        title: title || '',
        description: description || '',
        priority: priority || '',
        start_date: start_date ? new Date(start_date).toISOString().split('T')[0] : '',
        due_date: due_date ? new Date(due_date).toISOString().split('T')[0] : '',
        status: status || 'New',
        assigned_to: assigned_to || '',
      });
      setDisplayedUser(issueFormDetails.assigned_to_name || '');
    }
  }, [issueFormDetails]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchUser = async (e) => {
    const searchQuery = e.target.value;
    setDisplayedUser(searchQuery); // Update displayedUser with the search term
    setSearchTerm(searchQuery); // Update searchTerm for fetching users
    try {
      const response = await axios.get(`${BASE_URL}/users?search=${searchQuery}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSelectUser = (selectedUser) => {
    setDisplayedUser(selectedUser.friendly_name);
    setFormData({
      ...formData,
      assigned_to: selectedUser.id
    });
    setDisplayedUser(selectedUser.friendly_name);
    setUsers([]);
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <Modal show={true} onHide={handleClose} keyboard={false} backdrop="static" size='xl'>
      <Modal.Header closeButton>
        <Modal.Title>Create Issue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <Form onSubmit={handleSubmit} className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Project</Form.Label>
              <Form.Select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please select a project.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Issue Type</Form.Label>
              <Form.Select
                name="issue_type"
                value={formData.issue_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Issue Type</option>
                <option value="Task">Task</option>
                <option value="Story">Story</option>
                <option value="Bug">Bug</option>
                <option value="Epic">Epic</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please provide an issue type.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">Please provide a title.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
                <option value="1">P1</option>
                <option value="2">P2</option>
                <option value="3">P3</option>
                <option value="4">P4</option>
                <option value="5">P5</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please provide a priority.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Assigned To</Form.Label>
              <div>
                <Form.Control
                  type="text"
                  name="assigned_to"
                  value={displayedUser}
                  onChange={handleSearchUser}
                  onFocus={() => setUsers([])}
                  required
                  autoComplete="off"
                  className="mb-2"
                  placeholder='Type a name to search'
                />
                <ListGroup>
                  {users.map((user) => (
                    <ListGroup.Item
                      key={user.id}
                      action
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.friendly_name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <Form.Control.Feedback type="invalid">
                Please provide an assignee.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {/* <option value="">Select Status</option> */}
                <option value="New">New</option>
                {/* <option value="In Progress">In Progress</option>
                <option value="For Review">For Review</option>
                <option value="Done">Done</option> */}
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please provide a status.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-12">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">Please provide a description.</Form.Control.Feedback>
            </Form.Group>
            

            {/* <Form.Group className="mb-3 col-md-6">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">Please provide a start date.</Form.Control.Feedback>
            </Form.Group> */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">Please provide a due date.</Form.Control.Feedback>
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
        </div>
        
      </Modal.Body>
    </Modal>
  );
};

export default CreateIssueDialog;
