import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor'
import ProjectDialog from './Project/ProjectDialog';
import ConfirmDialog from '../Common/ConfirmDialog';

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
      console.log(response.data);
      setProjectDetails(response.data); // Set projectDetails first
      setSelectedProject(response.data); // Then set selectedProject
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let response;
      if (selectedProject) {
        // Update project
        response = await axios.put(`${BASE_URL}/projects/${selectedProject._id}`, formData);
      } else {
        // Add new project
        response = await axios.post(`${BASE_URL}/projects`, formData);
      }
      await fetchProjects();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
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
      console.log(response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/projects/${selectedProject}`);
      setProjects(projects.filter(project => project._id !== selectedProject));
      setShowConfirmDialog(false); 
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Project Management</h1>
      <button className="btn btn-primary mb-3" onClick={handleAddProject}>Add Project</button>

      <table className="table table-sm">
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
                <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEditProject(project)}><i className="fas fa-edit"></i> Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteProject(project._id)}><i className="fas fa-trash"></i> Delete</button>
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
