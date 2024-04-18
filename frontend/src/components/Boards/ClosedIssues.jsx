import React from 'react';
import IssueList from './IssueList';
import AccountService from '../../account_service';
import PermissionService from '../../permission_service';


const ClosedIssues = ({ userId, permissions }) => {
  const pageTitle = "Closed Issues";
  return (
    <div>
      {permissions?.includes('read_closed_issues') && userId && (
        <IssueList userId={userId}  pageTitle={pageTitle} />
        )}
    </div>
  );
};

export default AccountService(PermissionService(ClosedIssues));
