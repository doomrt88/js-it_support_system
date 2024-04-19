import React from 'react';
import IssueList from './IssueList';
import AccountService from '../../account_service';
import PermissionService from '../../permission_service';


const AllOpenIssues = ({ userId, permissions }) => {
  const pageTitle = "All Open Issues";
  return (
    <div>
      {permissions?.includes('read_all_open_issues') && userId && (
        <IssueList userId={userId}  pageTitle={pageTitle} />
        )}
    </div>
  );
};

export default AccountService(PermissionService(AllOpenIssues));
