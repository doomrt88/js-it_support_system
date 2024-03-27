import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor';

const IssueList = ({ userId, pageTitle }) => {
  const [issues, setIssues] = useState([]);

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

  return (
    <div>
      <h1>{pageTitle}</h1>

      <table className="table table-sm mt-4">
        <thead>
          <tr>
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
              <td>{issue.title}</td>
              <td>{issue.description}</td>
              <td>{issue.start_date ? new Date(issue.start_date).toLocaleDateString() : '-'}</td>
              <td>{new Date(issue.due_date).toLocaleDateString()}</td>
              <td>P{issue.priority}</td>
              <td>{issue.status}</td>
              <td>{issue.assigned_to.first_name} {issue.assigned_to.last_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueList;
