import React, { useState, useEffect } from 'react';
import axios from '../../../axios_interceptor'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './RoleDialog.css'

// NOTE: run the update_permissions.txt in mongoosh to update the permissions groups

const RoleDialog = ({ onSubmit, onCancel, roleFormDetails }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [permissions, setPermissions] = useState([]); 
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [formData, setFormData] = useState({
      name: roleFormDetails ? roleFormDetails.name : '',
      description: roleFormDetails ? roleFormDetails.description : ''
    });

    useEffect(() => {
      const fetchPermissions = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/permissions`);
          setPermissions(response.data);
          
          if (roleFormDetails) {
            setFormData({
              name: roleFormDetails.name || '',
              description: roleFormDetails.description || ''
            });
            setSelectedPermissions(roleFormDetails.permissions || []);
          }
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      };
    
      fetchPermissions();
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
          ...formData,
          permissions: selectedPermissions
        };
        onSubmit(updatedFormData);
    };

    const handleClose = () => {
      onCancel();
    };

    const handlePermissionToggle = (permissionId) => {
      const permissionObject = { _id: permissionId };
      if (selectedPermissions.some(p => p._id === permissionId)) {
        setSelectedPermissions(selectedPermissions.filter(p => p._id !== permissionId));
      } else {
        setSelectedPermissions([...selectedPermissions, permissionObject]);
      }
    };

    const isPermissionSelected = (permissionId) => {
      return selectedPermissions.some(permission => permission._id === permissionId);
    };

  return (
      <Modal show={true} onHide={handleClose} keyboard={false} backdrop="static" size="lg">
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
            <Form.Group className="mb-3 permissions-container">
                <Form.Label>Permissions</Form.Label>
                <div className="permissions-scrollable container">
                  <div className="row">
                    {permissions.map((group) => (
                      <div className="col-md-6" key={group.group_name}>
                        <div class="row">
                          <h6 class="pl-0 pr-0">{group.group_name}</h6>
                          {group.permissions.map((permission) => (
                            <Form.Check
                              key={permission._id}
                              type="checkbox"
                              id={permission._id}
                              label={permission.name}
                              checked={isPermissionSelected(permission._id)}
                              onChange={() => handlePermissionToggle(permission._id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
