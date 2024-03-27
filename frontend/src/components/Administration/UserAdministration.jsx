import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import UserDialog from './User/UserDialog';
import ConfirmDialog from '../Common/ConfirmDialog';

const UserAdministration = ({ onSubmit, onCancel }) => {
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
      console.log(response.data);
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
      await fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
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
      await axios.delete(`${BASE_URL}/users/${selectedUser}`);
      setUsers(users.filter(user => user._id !== selectedUser));
      setShowConfirmDialog(false); 
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User Management</h1>
      <button className="btn btn-primary mb-3" onClick={handleAddUser}>Add User</button>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.user_name}</td>
              <td>{user.friendly_name}</td>
              <td>{user.roles}</td>
              <td>
                <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEditUser(user)}><i className="fas fa-edit"></i> Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}><i className="fas fa-trash"></i> Delete</button>
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

export default UserAdministration;
