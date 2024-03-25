import React, { useState, useEffect } from 'react';

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
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title">Role</h5>
            <button type="button" className="close" onClick={handleClose} aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Role Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required autoComplete='off'/>
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea rows={10} className="form-control" name="description" value={formData.description} onChange={handleChange} required autoComplete='off' ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mr-2">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </form>
        </div>
        </div>
    );
};

export default RoleDialog;
