import React from 'react';
import IssueList from './IssueList';
import AccountService from '../../account_service';


const MySubmittedIssues = ({ userId }) => {
  const pageTitle = "My Submitted Issues";
  return (
    <div>
      {userId && <IssueList userId={userId}  pageTitle={pageTitle} tabName="MySubmittedIssues" />}
    </div>
  );
};

export default AccountService(MySubmittedIssues);
