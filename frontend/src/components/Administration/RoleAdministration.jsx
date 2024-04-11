import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import RoleDialog from './Role/RoleDialog';
import ConfirmDialog from '../Common/ConfirmDialog';
import { toast } from 'react-toastify';

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

      if (response.status === 200 || response.status === 201) {
        toast.success(`Role has been ${selectedRole ? 'updated' : 'created'} successfully.`, { autoClose: 700 });
        await fetchRoles();
        handleCloseDialog();

      } else {
        throw new Error('Invalid response from server');
      }

      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response ? error.response.data.message : error.message);
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
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/roles/${selectedRole}`);
      if (response.status === 200 || response.status === 201) {
        toast.success(`Role has been deleted successfully.`, { autoClose: 700 });
        setRoles(roles.filter(role => role._id !== selectedRole));
        setShowConfirmDialog(false); 
        await fetchRoles();
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <h4>Role Management</h4>
      <button className="btn btn-sm btn-success mb-3 mt-2" onClick={handleAddRole}><i className="fas fa-plus"></i> New Role</button>

      <table className="table table-md">
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
                <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEditRole(role)}><i className="fas fa-edit"></i> </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteRole(role._id)}><i className="fas fa-trash"></i> </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDialog && (
        <RoleDialog onSubmit={handleFormSubmit} onCancel={handleCloseDialog} roleFormDetails={roleDetails}/>
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
