import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import UserDialog from './User/UserDialog';
import ConfirmDialog from '../Common/ConfirmDialog';
import { toast } from 'react-toastify';
import AccountService from '../../account_service';
import PermissionService from '../../permission_service';

const UserAdministration = ({ onSubmit, onCancel, permissions }) => {
  const [users, setUsers] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // events here
  const handleAddUser = () => {
    setShowDialog(true);
    setSelectedUser(null);
  };

  const handleEditUser = async (user) => {
    setShowDialog(true);
    try {
      const response = await axios.get(`${BASE_URL}/users/${user.id}`);
      setUserDetails(response.data); // Set userDetails first
      setSelectedUser(response.data); // Then set selectedUser
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let response;
      if (selectedUser) {
        // Update user
        response = await axios.put(`${BASE_URL}/users/${selectedUser._id}`, formData);
        //setUsers(users.map(user => (user.id === selectedUser.id ? response.data.user : user)));
      } else {
        // Add new user
        response = await axios.post(`${BASE_URL}/users`, formData);
        //setUsers([...users, response.data.user]);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`User has been ${selectedUser ? 'updated' : 'created'} successfully.`, { autoClose: 700 });
        await fetchUsers();
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
    setSelectedUser(null);
  };

  const deleteUser = async (id) => {
    setSelectedUser(id);
    setShowConfirmDialog(true); 
  };

  const cancelDelete = () => {
    setSelectedUser(null);
    setShowConfirmDialog(false);
  };

  // API calls here
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${selectedUser}`);

      if (response.status === 200 || response.status === 201) {
        toast.success(`User has been deleted successfully.`, { autoClose: 700 });
        setUsers(users.filter(user => user._id !== selectedUser));
        setShowConfirmDialog(false); 
        await fetchUsers();

      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h4>User Management</h4>
      {permissions?.includes('write_users') && (
        <button className="btn btn-sm btn-success mb-3 mt-2" onClick={handleAddUser}><i className="fas fa-plus"></i> New User</button>
      )}

      <table className="table table-md">
        <thead>
          <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Projects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.user_name}</td>
              <td>{user.friendly_name}</td>
              <td>{user.roles}</td>
              <td>{user.projects}</td>
              <td>
                {permissions?.includes('write_users') && (
                  <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEditUser(user)}><i className="fas fa-edit"></i></button>
                )}
                {permissions?.includes('delete_users') && (
                  <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}><i className="fas fa-trash"></i></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDialog && (
        <UserDialog onSubmit={handleFormSubmit} onCancel={handleCloseDialog} userFormDetails={userDetails}/>
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this user?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AccountService(PermissionService(UserAdministration));