import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor';

const IssueList = ({ userId, pageTitle }) => {
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // API calls here
  const fetchIssues = async (page) => {
    try {
      if (page < 1) return;

      let response;
      if (pageTitle === "All Issues") {
        response = await axios.get(`/issues?page=${page}`);
      } else if (pageTitle === "My Submitted Issues") {
        response = await axios.get(`/my-submitted-issues/${userId}?page=${page}`);
      } else if (pageTitle === "My Open Issues") {
        response = await axios.get(`/my-open-issues/${userId}?page=${page}`);
      } else if (pageTitle === "Closed Issues") {
        response = await axios.get(`/closed-issues/${userId}?page=${page}`);
      } else if (pageTitle === "All Open Issues") {
        response = await axios.get(`/open-issues?page=${page}`);
      }

      console.log(response.data);
      if (response.data) {
        setIssues(response.data.issues);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  useEffect(() => {
    fetchIssues(currentPage);
  }, [userId, pageTitle, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h4>{pageTitle}</h4>

      <table className="table table-md mt-4">
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
              <td>{issue.project?.name}</td>
              <td>{issue.title}</td>
              <td>{issue.description}</td>
              <td>{issue.start_date ? new Date(issue.start_date).toLocaleDateString() : '-'}</td>
              <td>{new Date(issue.due_date).toLocaleDateString()}</td>
              <td>
                {issue.priority === 1 && <span className="badge badge-danger">P1</span>}
                {issue.priority === 2 && <span className="badge badge-warning">P2</span>}
                {issue.priority !== 1 && issue.priority !== 2 && <span className="badge badge-primary">P{issue.priority}</span>}
              </td>
              <td>{issue.status}</td>
              <td>{issue.assigned_to.first_name} {issue.assigned_to.last_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-center">
      <nav aria-label="...">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
            <button className="page-link" onClick={() => fetchIssues(currentPage - 1)}>Previous</button>
          </li>
          {[...Array(totalPages).keys()].map((page) => (
            <li key={page + 1} className={`page-item ${currentPage === page + 1 && 'active'}`}>
              <button className="page-link" onClick={() => fetchIssues(page + 1)}>{page + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
            <button className="page-link" onClick={() => fetchIssues(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
      </div>
    </div>
  );
};

export default IssueList;
