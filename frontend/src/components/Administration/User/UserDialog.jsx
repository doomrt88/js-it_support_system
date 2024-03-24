import React, { useState, useEffect } from 'react';
import axios from '../../../axios_interceptor'

const UserDialog = ({ onSubmit, onCancel, userFormDetails }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [formData, setFormData] = useState({
      user_name: userFormDetails ? userFormDetails.user_name : '',
      password: userFormDetails ? userFormDetails.password : '',
      first_name: userFormDetails ? userFormDetails.first_name : '',
      last_name: userFormDetails ? userFormDetails.last_name : '',
      //roles: userFormDetails ? userFormDetails.roles : []
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

        fetchRoles();
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
          roles: selectedRoles
        };
        onSubmit(updatedFormData);
    };

    const handleClose = () => {
      onCancel();
    };

  return (
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title">User</h5>
            <button type="button" className="close" onClick={handleClose} aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>User Name</label>
                <input type="text" className="form-control" name="user_name" value={formData.user_name} onChange={handleChange} required autoComplete='off'/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required autoComplete='off' />
            </div>
            <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required autoComplete='off' />
            </div>
            <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} autoComplete='off' />
            </div>
            <div className="form-group">
              <label>Roles</label>
              <select multiple className="form-control" value={selectedRoles} onChange={e => setSelectedRoles(Array.from(e.target.selectedOptions, option => option.value))}>
                {roles.map(role => (
                  <option key={role._id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary mr-2">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </form>
        </div>
        </div>
    );
};

export default UserDialog;
