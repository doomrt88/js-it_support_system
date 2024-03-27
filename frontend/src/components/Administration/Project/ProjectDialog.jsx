import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const ProjectDialog = ({ onSubmit, onCancel, projectFormDetails }) => {
  const [formData, setFormData] = useState({
    name: projectFormDetails ? projectFormDetails.name : '',
    description: projectFormDetails ? projectFormDetails.description : '',
    start_date: projectFormDetails ? projectFormDetails.start_date : '',
    end_date: projectFormDetails ? projectFormDetails.end_date : ''
  });

  useEffect(() => {
    if (projectFormDetails) {
      const { name, description, start_date, end_date } = projectFormDetails;
      setFormData({
        name: name || '',
        description: description || '',
        start_date: start_date ? new Date(start_date).toISOString().split('T')[0] : '', // Convert to "YYYY-MM-DD"
        end_date: end_date ? new Date(end_date).toISOString().split('T')[0] : '' // Convert to "YYYY-MM-DD"
      });
    }
  }, [projectFormDetails]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <Modal show={true} onHide={handleClose} keyboard={false} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formProjectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">Please provide a project name.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescription">
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
            <Form.Control.Feedback type="invalid">Please provide a project description.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formStartDate">
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
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">Please provide an end date.</Form.Control.Feedback>
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

export default ProjectDialog;
