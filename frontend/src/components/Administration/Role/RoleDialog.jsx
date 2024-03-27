import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const RoleDialog = ({ onSubmit, onCancel, roleFormDetails }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [formData, setFormData] = useState({
      name: roleFormDetails ? roleFormDetails.name : '',
      description: roleFormDetails ? roleFormDetails.description : ''
    });

    useEffect(() => {

      if (roleFormDetails) {
          setFormData({
            name: roleFormDetails.name || '',
            description: roleFormDetails.description || ''
          });
      }
  }, [roleFormDetails]);

    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFormData = {
          ...formData
        };
        onSubmit(updatedFormData);
    };

    const handleClose = () => {
      onCancel();
    };

  return (
      <Modal show={true} onHide={handleClose} keyboard={false} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} autoFocus onChange={handleChange} required autoComplete='off'
              />
            </Form.Group>
            <Form.Group
              className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={10} name="description" value={formData.description} onChange={handleChange} required autoComplete='off' />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} size="md">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} size="md">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default RoleDialog;
