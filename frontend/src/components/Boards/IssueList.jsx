import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor';
import EditIssueDialog from '../Issues/EditIssueDialog';
import ConfirmDialog from '../Common/ConfirmDialog';
import { toast } from 'react-toastify';

const IssueList = ({ userId, pageTitle, tabName }) => {
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalInfo, setModalInfo] = useState(null);
  const [selectedModalInfo, setSelectedModalInfo] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const handleCloseDialog = () => setShowDialog(false);
  const handleShowDialog = () => setShowDialog(true);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const confirmUpdateIssueStatus = async (id) => {
    setSelectedIssueId(id);
    setShowConfirmDialog(true); 
  };

  const updateIssueStatus = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/issues/${selectedIssueId}`, {
        status: 'In Progress', 
        start_date: new Date().toISOString()
      });
  
      if (response.status === 200 || response.status === 201) {
        toast.success(`Issue has been started successfully.`, { autoClose: 700 });
        setShowConfirmDialog(false); 
        await fetchIssues(currentPage);
      }else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  const cancelStart = () => {
    setSelectedIssueId(null);
    setShowConfirmDialog(false);
  };
  
  return (
    <div>
      <h4>{pageTitle}</h4>

      <table className="table table-md mt-4">
        <thead>
          <tr>
            <th>Issue #</th>
            <th>Project</th>
            <th>Summary</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th className='actions'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue._id}>
              <td>{issue.issue_number}</td>
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
              <td>
                {tabName !== 'MySubmittedIssues' && issue.status === 'New' && (
                  <button className="btn btn-sm btn-success mr-1" onClick={() => confirmUpdateIssueStatus(issue._id)} title="Start Issue">
                    <i className="fas fa-play"></i>
                  </button>
                )}
                {issue.status !== 'Closed' && (
                  <button className="btn btn-sm btn-warning mr-2" onClick={() => openEdit(issue)}  title="Edit Issue">
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </td>
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
      {showDialog&&(<EditIssueDialog onSubmit={handleFormSubmit} onCancel={handleCloseDialog} issueFormDetails={modalInfo}/>)}
      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to start working on this issue?"
          onConfirm={updateIssueStatus}
          onCancel={cancelStart}
        />
      )}
    </div>
  );
};

export default IssueList;
