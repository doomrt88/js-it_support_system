import React, { useState }  from 'react';
import Navbar from '../../Navbar';
import UserAdministration from './UserAdministration';
import RoleAdministration from './RoleAdministration';
import ProjectAdministration from './ProjectAdministration';

const Administration = () => {
  const [breadcrumbItems, setBreadcrumbItems] = useState(["Users"]);
  const handleTabClick = (tabTitle) => {
    setBreadcrumbItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.pop();
      updatedItems.push(tabTitle); 
      return updatedItems;
    });
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row mt-2">
        <div className="col-sm-12">
          <nav aria-label="breadcrumb mb-0">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><i className="fas fa-home"></i></li>
              <li className="breadcrumb-item">Administration</li>
                {breadcrumbItems.map((item, index) => (
                <li key={index} className="breadcrumb-item">{item}</li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col-sm-3">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="v-pills-users-tab" data-toggle="pill" href="#v-pills-users" role="tab" aria-controls="v-pills-users" aria-selected="true" onClick={() => handleTabClick("Users")}>Users</a>
            <a className="nav-link" id="v-pills-roles-tab" data-toggle="pill" href="#v-pills-roles" role="tab" aria-controls="v-pills-roles" aria-selected="false" onClick={() => handleTabClick("Roles")}>Roles</a>
            <a className="nav-link" id="v-pills-projects-tab" data-toggle="pill" href="#v-pills-projects" role="tab" aria-controls="v-pills-projects" aria-selected="false" onClick={() => handleTabClick("Projects")}>Projects</a>
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
