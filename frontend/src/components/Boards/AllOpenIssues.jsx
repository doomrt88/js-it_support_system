import React from 'react';
import IssueList from './IssueList';
import AccountService from '../../account_service';


const AllOpenIssues = ({ userId }) => {
  const pageTitle = "All Open Issues";
  return (
    <div>
      {userId && <IssueList userId={userId}  pageTitle={pageTitle} />}
    </div>
  );
};

export default AccountService(AllOpenIssues);
