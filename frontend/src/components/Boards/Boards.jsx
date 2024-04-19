import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar';
import MyOpenIssues from './MyOpenIssues';
import AllOpenIssues from './AllOpenIssues';
import MySubmittedIssues from './MySubmittedIssues';
import ClosedIssues from './ClosedIssues';
import AccountService from '../../account_service';
import PermissionService from '../../permission_service';

const Boards = ({ userId, permissions }) => {
  const [activeTab, setActiveTab] = useState('v-pills-myopenissues');
  const [breadcrumbItems, setBreadcrumbItems] = useState(["My Open Issues"]);
  const [activated, setActivated] = useState(false);

  const handleTabChange = (tabId, tabTitle) => {
    setActiveTab(tabId);

    setBreadcrumbItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.pop();
      updatedItems.push(tabTitle); 
      return updatedItems;
    });
  };

  
  if(permissions && permissions.length > 0 && !activated){
    let tabTitle = "My Open Issues";
    if (permissions?.includes('read_my_open_issues')) {
      setActiveTab('v-pills-myopenissues');
      tabTitle = "My Open Issues";
    } else if (permissions?.includes('read_all_open_issues')) {
      setActiveTab('v-pills-openissues');
      tabTitle = "All Open Issues";
    } else if (permissions?.includes('read_submitted_issues')) {
      setActiveTab('v-pills-mysubmittedissues');
      tabTitle = "My Submitted Issues";
    } else if (permissions?.includes('read_closed_issues')) {
      setActiveTab('v-pills-closedissues');
      tabTitle = "Closed Issues";
    }

    setActivated(true);
    setBreadcrumbItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.pop();
      updatedItems.push(tabTitle); 
      return updatedItems;
    });
}

  return (
    <div>
      <Navbar />
      <div className='container-fluid '>
      <div className="row mt-2">
        <div className="col-sm-12">
          <nav aria-label="breadcrumb mb-0">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><i className="fas fa-home"></i></li>
              <li className="breadcrumb-item">Boards</li>
                {breadcrumbItems.map((item, index) => (
                <li key={index} className="breadcrumb-item">{item}</li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col-sm-2">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            {permissions?.includes('read_my_open_issues') && (
              <a className={`nav-link ${activeTab === 'v-pills-myopenissues' ? 'active' : ''}`} id="v-pills-myopenissues-tab" onClick={() => handleTabChange('v-pills-myopenissues', 'My Open Issues')} data-toggle="pill" href="#v-pills-myopenissues" role="tab" aria-controls="v-pills-myopenissues" aria-selected={activeTab === 'v-pills-myopenissues'}>My Open Issues</a>
            )}
            {permissions?.includes('read_all_open_issues') && (
              <a className={`nav-link ${activeTab === 'v-pills-openissues' ? 'active' : ''}`} id="v-pills-openissues-tab" onClick={() => handleTabChange('v-pills-openissues', 'All Open Issues')} data-toggle="pill" href="#v-pills-openissues" role="tab" aria-controls="v-pills-openissues" aria-selected={activeTab === 'v-pills-openissues'}>All Open Issues</a>
            )}
            {permissions?.includes('read_submitted_issues') && (
              <a className={`nav-link ${activeTab === 'v-pills-mysubmittedissues' ? 'active' : ''}`} id="v-pills-mysubmittedissues-tab" onClick={() => handleTabChange('v-pills-mysubmittedissues', 'My Submitted Issues')} data-toggle="pill" href="#v-pills-mysubmittedissues" role="tab" aria-controls="v-pills-mysubmittedissues" aria-selected={activeTab === 'v-pills-mysubmittedissues'}>My Submitted Issues</a>
            )}
            {permissions?.includes('read_closed_issues') && (
              <a className={`nav-link ${activeTab === 'v-pills-closedissues' ? 'active' : ''}`} id="v-pills-closedissues-tab" onClick={() => handleTabChange('v-pills-closedissues', 'Closed Issues')} data-toggle="pill" href="#v-pills-closedissues" role="tab" aria-controls="v-pills-closedissues" aria-selected={activeTab === 'v-pills-closedissues'}>Closed Issues</a>
            )}
          </div>
        </div>
        <div className="col-sm-10">
          <div className="tab-content" id="v-pills-tabContent">
            {permissions?.includes('read_my_open_issues') && (
              <div className={`tab-pane fade ${activeTab === 'v-pills-myopenissues' ? 'show active' : ''}`} id="v-pills-myopenissues" role="tabpanel" aria-labelledby="v-pills-myopenissues-tab">
                <MyOpenIssues />
              </div>
            )}
            {permissions?.includes('read_all_open_issues') && (
              <div className={`tab-pane fade ${activeTab === 'v-pills-openissues' ? 'show active' : ''}`} id="v-pills-openissues" role="tabpanel" aria-labelledby="v-pills-openissues-tab">
                <AllOpenIssues />
              </div>
            )}
            {permissions?.includes('read_submitted_issues') && (
              <div className={`tab-pane fade ${activeTab === 'v-pills-mysubmittedissues' ? 'show active' : ''}`} id="v-pills-mysubmittedissues" role="tabpanel" aria-labelledby="v-pills-mysubmittedissues-tab">
                <MySubmittedIssues />
              </div>
            )}
            {permissions?.includes('read_closed_issues') && (
              <div className={`tab-pane fade ${activeTab === 'v-pills-closedissues' ? 'show active' : ''}`} id="v-pills-closedissues" role="tabpanel" aria-labelledby="v-pills-closedissues-tab">
                <ClosedIssues />
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AccountService(PermissionService(Boards));