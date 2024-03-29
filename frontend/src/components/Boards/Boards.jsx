import React, { useState } from 'react';
import Navbar from '../../Navbar';
import MyOpenIssues from './MyOpenIssues';
import AllOpenIssues from './AllOpenIssues';
import MySubmittedIssues from './MySubmittedIssues';
import ClosedIssues from './ClosedIssues';

const Boards = () => {
  const [activeTab, setActiveTab] = useState('v-pills-myopenissues');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row mt-4"></div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className={`nav-link ${activeTab === 'v-pills-myopenissues' ? 'active' : ''}`} id="v-pills-myopenissues-tab" onClick={() => handleTabChange('v-pills-myopenissues')} data-toggle="pill" href="#v-pills-myopenissues" role="tab" aria-controls="v-pills-myopenissues" aria-selected={activeTab === 'v-pills-myopenissues'}>My Open Issues</a>
            <a className={`nav-link ${activeTab === 'v-pills-openissues' ? 'active' : ''}`} id="v-pills-openissues-tab" onClick={() => handleTabChange('v-pills-openissues')} data-toggle="pill" href="#v-pills-openissues" role="tab" aria-controls="v-pills-openissues" aria-selected={activeTab === 'v-pills-openissues'}>All Open Issues</a>
            <a className={`nav-link ${activeTab === 'v-pills-mysubmittedissues' ? 'active' : ''}`} id="v-pills-mysubmittedissues-tab" onClick={() => handleTabChange('v-pills-mysubmittedissues')} data-toggle="pill" href="#v-pills-mysubmittedissues" role="tab" aria-controls="v-pills-mysubmittedissues" aria-selected={activeTab === 'v-pills-mysubmittedissues'}>My Submitted Issues</a>
            <a className={`nav-link ${activeTab === 'v-pills-closedissues' ? 'active' : ''}`} id="v-pills-closedissues-tab" onClick={() => handleTabChange('v-pills-closedissues')} data-toggle="pill" href="#v-pills-closedissues" role="tab" aria-controls="v-pills-closedissues" aria-selected={activeTab === 'v-pills-closedissues'}>Closed Issues</a>
          </div>
        </div>
        <div className="col-sm-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div className={`tab-pane fade ${activeTab === 'v-pills-myopenissues' ? 'show active' : ''}`} id="v-pills-myopenissues" role="tabpanel" aria-labelledby="v-pills-myopenissues-tab">
              <MyOpenIssues />
            </div>
            <div className={`tab-pane fade ${activeTab === 'v-pills-openissues' ? 'show active' : ''}`} id="v-pills-openissues" role="tabpanel" aria-labelledby="v-pills-openissues-tab">
              <AllOpenIssues />
            </div>
            <div className={`tab-pane fade ${activeTab === 'v-pills-mysubmittedissues' ? 'show active' : ''}`} id="v-pills-mysubmittedissues" role="tabpanel" aria-labelledby="v-pills-mysubmittedissues-tab">
              <MySubmittedIssues />
            </div>
            <div className={`tab-pane fade ${activeTab === 'v-pills-closedissues' ? 'show active' : ''}`} id="v-pills-closedissues" role="tabpanel" aria-labelledby="v-pills-closedissues-tab">
              <ClosedIssues />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boards;
