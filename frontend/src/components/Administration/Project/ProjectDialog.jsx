import React, { useState, useEffect } from 'react';

const ProjectDialog = ({ onSubmit, onCancel, projectFormDetails }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);

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
                <h5 className="modal-title">Project</h5>
                <button type="button" className="close" onClick={handleClose} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Project Name</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required autoComplete='off'/>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea rows={10} className="form-control" name="description" value={formData.description} onChange={handleChange} required autoComplete='off'></textarea>
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} autoComplete='off'/>
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} autoComplete='off'/>
                    </div>
                    <button type="submit" className="btn btn-primary mr-2">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
  
};

export default ProjectDialog;
