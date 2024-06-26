import React, { useState, useEffect } from 'react';
import axios from '../../axios_interceptor';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';

const EditIssueDialog = ({ onSubmit, onCancel, issueFormDetails }) => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [displayedUser, setDisplayedUser] = useState(issueFormDetails? issueFormDetails.assigned_to.first_name + ' ' + issueFormDetails.assigned_to.last_name  : '');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState(issueFormDetails? issueFormDetails.project : null);
    const [assignedUser, setAssignedUser] = useState(issueFormDetails? issueFormDetails.assigned_to : null);
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [formData, setFormData] = useState({
      _id: issueFormDetails ? issueFormDetails._id : '',
      issue_number: issueFormDetails ? issueFormDetails.issue_number : '',
      title: issueFormDetails ? issueFormDetails.title : '',
      description: issueFormDetails ? issueFormDetails.description : '',
      priority: issueFormDetails ? issueFormDetails.priority : '',
      issue_type: issueFormDetails ? issueFormDetails.issue_type : '',
      start_date: issueFormDetails ? issueFormDetails.start_date : '',
      due_date: issueFormDetails ? issueFormDetails.due_date : '',
      status: issueFormDetails ? issueFormDetails.status : 'New',
      assigned_to: issueFormDetails ? issueFormDetails.assigned_to._id : '',
      project: issueFormDetails ? issueFormDetails.project._id : ''
    });
    
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/projects`);
        setProjects(response.data);
        //if(issueFormDetails){
         // setSelectedProject(projects.filter(_id => _id === issueFormDetails.project._id));
        //  console.log(selectedProject);
        //}
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };


    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users?search=${searchTerm}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchProjects();
    if (searchTerm) {
      fetchUsers();
    }
    getComments();


  }, []);

  useEffect(() => {
      if (issueFormDetails) {
        const { _id, issue_number, title, description, priority, issue_type, start_date, due_date, status, assigned_to, project } = issueFormDetails;
        setFormData({
          _id: _id || '',
          issue_number: issue_number || '',
          title: title || '',
          description: description || '',
          priority: priority || '',
          issue_type: issue_type || '',
          start_date: start_date ? new Date(start_date).toISOString().split('T')[0] : '',
          due_date: due_date ? new Date(due_date).toISOString().split('T')[0] : '',
          status: status || 'New',
          assigned_to: assigned_to._id || '',
          project: project._id || ''
        });
        setAssignedUser(issueFormDetails.assigned_to || null);
        setSelectedProject(issueFormDetails.project || null);
      }
    }, [issueFormDetails]);

    const handleSearchUser = async (e) => {
      const searchQuery = e.target.value;
      setDisplayedUser(searchQuery); // Update displayedUser with the search term
      setSearchTerm(searchQuery); // Update searchTerm for fetching users
      try {
        const response = await axios.get(`${BASE_URL}/users?search=${searchQuery}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    const handleSelectUser = (selectedUser) => {
      setDisplayedUser(selectedUser.friendly_name);
      setFormData({
        ...formData,
        assigned_to: selectedUser.id
      });
      setDisplayedUser(selectedUser.friendly_name);
      setUsers([]);
      setSearchTerm('');
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    }

    const getComments = async () => {
      try{
        const response = await axios.get(`${BASE_URL}/comment/${formData.issue_number}`);
        setCommentList(response.data);
      }catch(error){
        console.error('Error:',error);
      }
    }

    const saveComment = async () => {
      try{
        if(comment.trim() !== ""){
          const response = await axios.post(`${BASE_URL}/comment`, {
            value: comment,
            issue_number: formData.issue_number
          });
          getComments();
        }
      }catch(error){
        console.error('Error:', error);
      }
    }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    const handleClose = () => {
        onCancel();
    };
    
    return(
      <Modal show={true} onHide={handleClose} backdrop="static" size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Edit Issue #<b><u>{formData.issue_number}</u></b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="container">
          <Form onSubmit={handleSubmit} className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Project</Form.Label>
              <Form.Select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value={selectedProject._id}>{selectedProject.name}</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please select a project.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Issue Type</Form.Label>
              <Form.Select
                name="issue_type"
                value={formData.issue_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Issue Type</option>
                <option value="Task">Task</option>
                <option value="Story">Story</option>
                <option value="Bug">Bug</option>
                <option value="Epic">Epic</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please provide an issue type.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">Please provide a title.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
                <option value="1">P1</option>
                <option value="2">P2</option>
                <option value="3">P3</option>
                <option value="4">P4</option>
                <option value="5">P5</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please provide a priority.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Assigned To</Form.Label>
              <div>
                <Form.Control
                  type="text"
                  name="assigned_to"
                  value={displayedUser}
                  onChange={handleSearchUser}
                  onFocus={() => setUsers([])}
                  required
                  autoComplete="off"
                  className="mb-2"
                  placeholder='Type a name to search'
                />
                <ListGroup>
                  {users.map((user) => (
                    <ListGroup.Item
                      key={user.id}
                      action
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.friendly_name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <Form.Control.Feedback type="invalid">
                Please provide an assignee.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="For Review">For Review</option>
                <option value="Closed">Closed</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please provide a status.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-12">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">Please provide a description.</Form.Control.Feedback>
            </Form.Group>
            

            {['New', 'In Progress'].includes(formData.status) && (
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">Please provide a start date.</Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">Please provide a due date.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 col-md-12">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="comment"
                value={comment}
                onChange={handleCommentChange}
                autoComplete="off"
              />
              <Button className="btn-comment" disabled={!comment} variant="secondary" onClick={saveComment} size="sm">Save Comment</Button>
              {commentList && (
                <div class="w-100">
                {commentList.map(cmt => 
                  <div className="comment-block">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex flex-row align-items-center">
                        <span class="mr-2">{cmt.created_by.first_name} {cmt.created_by.last_name}</span>
                      </div>
                      <small>{cmt.created_at}</small>
                  </div>
                  <p class="text-justify comment-text mb-0">{cmt.value}</p>

                  </div>
                )}
                </div> 
              )}
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} size="md">
                Cancel
              </Button>
              <Button variant="primary" type="submit" size="md">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </div>
        </Modal.Body>
      </Modal>
    )
  };

  export default EditIssueDialog;