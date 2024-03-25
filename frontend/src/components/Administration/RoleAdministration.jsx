import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import RoleDialog from './Role/RoleDialog';
import ConfirmDialog from '../Common/ConfirmDialog';

const RoleAdministration = ({ onSubmit, onCancel }) => {
  const [roles, setRoles] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleDetails, setRoleDetails] = useState(null); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // events here
  const handleAddRole = () => {
    setShowDialog(true);
    setSelectedRole(null);
  };

  const handleEditRole = async (role) => {
    setShowDialog(true);
    try {
      const response = await axios.get(`${BASE_URL}/roles/${role._id}`);
      console.log(response.data);
      setRoleDetails(response.data); // Set roleDetails first
      setSelectedRole(response.data); // Then set selectedRole
    } catch (error) {
      console.error('Error fetching role details:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let response;
      if (selectedRole) {
        // Update role
        response = await axios.put(`${BASE_URL}/roles/${selectedRole._id}`, formData);
      } else {
        // Add new role
        response = await axios.post(`${BASE_URL}/roles`, formData);
      }
      await fetchRoles();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedRole(null);
  };

  const deleteRole = async (id) => {
    setSelectedRole(id);
    setShowConfirmDialog(true); 
  };

  const cancelDelete = () => {
    setSelectedRole(null);
    setShowConfirmDialog(false);
  };

  // API calls here
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/roles`);
      console.log(response.data);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/roles/${selectedRole}`);
      setRoles(roles.filter(role => role._id !== selectedRole));
      setShowConfirmDialog(false); 
      await fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <h1>Role Management</h1>
      <button className="btn btn-primary mb-3" onClick={handleAddRole}>Add Role</button>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role._id}>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEditRole(role)}><i className="fas fa-edit"></i> Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteRole(role._id)}><i className="fas fa-trash"></i> Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDialog && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <RoleDialog onSubmit={handleFormSubmit} onCancel={handleCloseDialog} roleFormDetails={roleDetails}/>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this role?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default RoleAdministration;
