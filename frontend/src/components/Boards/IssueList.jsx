import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor';
import EditIssueDialog from '../Issues/EditIssueDialog';

const IssueList = ({ userId, pageTitle }) => {
  const [issues, setIssues] = useState([]);
  const [modalInfo, setModalInfo] = useState(null);
  const [selectedModalInfo, setSelectedModalInfo] = useState(null);

  const [showDialog, setShowDialog] = useState(false);
  const handleCloseDialog = () => setShowDialog(false);
  const handleShowDialog = () => setShowDialog(true);
  // API calls here
  const fetchIssues = async () => {
    try {
      let response;
      if (pageTitle === "All Issues") {
        response = await axios.get(`/issues`);
      } else if (pageTitle === "My Submitted Issues") {
        response = await axios.get(`/my-submitted-issues/${userId}`);
      } else if (pageTitle === "My Open Issues") {
        response = await axios.get(`/my-open-issues/${userId}`);
      } else if (pageTitle === "Closed Issues") {
        response = await axios.get(`/closed-issues/${userId}`);
      }
      else if (pageTitle === "All Open Issues") {
        response = await axios.get(`/open-issues`);
      }
      
      if(pageTitle)
        setIssues(response.data);
    
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [userId, pageTitle]);

  const openEdit =  (row) => {
      setModalInfo(row);
      setSelectedModalInfo(row);
      setShowDialog(handleShowDialog);
  }
/*
  const handleEditIssue = async (issue) => {
    setShowDialog(true);
    try {
      const response = await axios.get(`${BASE_URL}/issues/${issue._id}`);
      console.log("Issue received  --  "+response.data);
      setModalInfo(response.data); // Set userDetails first
      setSelectedModalInfo(response.data); // Then set selectedUser
    } catch (error) {
      console.error('Error fetching issue details:', error);
    }
  };
*/
  const handleFormSubmit = async (formData) => {
    try {
      let response;
      if(selectedModalInfo){
        response = await axios.put(`${BASE_URL}/issues/${selectedModalInfo._id}`, formData);
      }else{
        response = await axios.post(`${BASE_URL}/issues`, formData);
      }
      await fetchIssues();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>{pageTitle}</h1>

      <table className="table table-sm mt-4">
        <thead>
          <tr>
            <th>Project</th>
            <th>Summary</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue._id}>
              <td>{issue.project.name}</td>
              <td>{issue.title}</td>
              <td>{issue.description}</td>
              <td>{issue.start_date ? new Date(issue.start_date).toLocaleDateString() : '-'}</td>
              <td>{new Date(issue.due_date).toLocaleDateString()}</td>
              <td>P{issue.priority}</td>
              <td>{issue.status}</td>
              <td>{issue.assigned_to.first_name} {issue.assigned_to.last_name}</td>
              <td><button className="btn btn-sm btn-secondary mr-2" onClick={()=> openEdit(issue)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDialog&&(<EditIssueDialog onSubmit={handleFormSubmit} onCancel={handleCloseDialog} issueFormDetails={modalInfo}/>)}
    </div>
  );
};

export default IssueList;
