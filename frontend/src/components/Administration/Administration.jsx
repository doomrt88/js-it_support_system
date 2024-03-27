import React from 'react';
import Navbar from '../../Navbar';
import UserAdministration from './UserAdministration';
import RoleAdministration from './RoleAdministration';
import ProjectAdministration from './ProjectAdministration';

const Administration = () => {
  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row mt-4">
        <h1 className="col-sm-12">Administration</h1>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col-sm-3">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="v-pills-users-tab" data-toggle="pill" href="#v-pills-users" role="tab" aria-controls="v-pills-users" aria-selected="true">Users</a>
            <a className="nav-link" id="v-pills-roles-tab" data-toggle="pill" href="#v-pills-roles" role="tab" aria-controls="v-pills-roles" aria-selected="false">Roles</a>
            <a className="nav-link" id="v-pills-projects-tab" data-toggle="pill" href="#v-pills-projects" role="tab" aria-controls="v-pills-projects" aria-selected="false">Projects</a>
          </div>
        </div>
        <div className="col-sm-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div className="tab-pane fade show active" id="v-pills-users" role="tabpanel" aria-labelledby="v-pills-users-tab">
              <UserAdministration />
            </div>
            <div className="tab-pane fade" id="v-pills-roles" role="tabpanel" aria-labelledby="v-pills-roles-tab">
              <RoleAdministration />
            </div>
            <div className="tab-pane fade" id="v-pills-projects" role="tabpanel" aria-labelledby="v-pills-projects-tab">
              <ProjectAdministration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
