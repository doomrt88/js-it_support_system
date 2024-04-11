import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import ProjectDialog from './Project/ProjectDialog';
import ConfirmDialog from '../Common/ConfirmDialog';
import { toast } from 'react-toastify';

const ProjectAdministration = ({ onSubmit, onCancel }) => {
  const [projects, setProjects] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // events here
  const handleAddProject = () => {
    setShowDialog(true);
    setSelectedProject(null);
  };

  const handleEditProject = async (project) => {
    setShowDialog(true);
    try {
      const response = await axios.get(`${BASE_URL}/projects/${project._id}`);
      setProjectDetails(response.data); // Set projectDetails first
      setSelectedProject(response.data); // Then set selectedProject
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        toast.error('End date must be after start date.');
        return;
      }
      
      let response;
      if (selectedProject) {
        // Update project
        response = await axios.put(`${BASE_URL}/projects/${selectedProject._id}`, formData);
      } else {
        // Add new project
        response = await axios.post(`${BASE_URL}/projects`, formData);
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(`Project has been ${selectedProject ? 'updated' : 'created'} successfully.`, { autoClose: 700 });
        await fetchProjects();
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
    setSelectedProject(null);
  };

  const deleteProject = async (id) => {
    setSelectedProject(id);
    setShowConfirmDialog(true); 
  };

  const cancelDelete = () => {
    setSelectedProject(null);
    setShowConfirmDialog(false);
  };

  // API calls here
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/projects/${selectedProject}`);
      if (response.status === 200 || response.status === 201) {
        toast.success(`Project has been deleted successfully.`, { autoClose: 700 });
        setProjects(projects.filter(project => project._id !== selectedProject));
        setShowConfirmDialog(false); 
        await fetchProjects();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h4>Project Management</h4>
      <button className="btn btn-sm btn-success mb-3 mt-2" onClick={handleAddProject}><i className="fas fa-plus"></i> New Project</button>

      <table className="table table-md">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{new Date(project.start_date).toLocaleDateString()}</td>
              <td>{new Date(project.end_date).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEditProject(project)}><i className="fas fa-edit"></i></button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteProject(project._id)}><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDialog && (
        <ProjectDialog onSubmit={handleFormSubmit} onCancel={handleCloseDialog} projectFormDetails={projectDetails}/>
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ProjectAdministration;
