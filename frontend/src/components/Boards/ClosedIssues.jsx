import React from 'react';
import AccountService from '../../account_service'; 
import IssueList from './IssueList';

const ClosedIssues = ({ userId }) => {
  const pageTitle = "Closed Issues";

  return (
    <div>
      {userId && <IssueList userId={userId} pageTitle={pageTitle} />}
    </div>
  );
};

export default AccountService(ClosedIssues);
