import React from 'react';
import IssueList from './IssueList';
import AccountService from '../../account_service';
import PermissionService from '../../permission_service';

const MySubmittedIssues = ({ userId, permissions }) => {
  const pageTitle = "My Submitted Issues";
  return (
    <div>
      {permissions?.includes('read_submitted_issues') && userId && (
        <IssueList userId={userId}  pageTitle={pageTitle} tabName="MySubmittedIssues" />
        )}
    </div>
  );
};

export default AccountService(PermissionService(MySubmittedIssues));
