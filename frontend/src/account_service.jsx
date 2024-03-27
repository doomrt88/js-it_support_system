import React, { useEffect, useState } from 'react';

const AccountService = (WrappedComponent) => {
  return (props) => {
    const [userId, setUserId] = useState('');

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user);
      if (user) {
        setUserId(user.id);
      }
    }, []);

    return <WrappedComponent userId={userId} {...props} />;
  };
};

export default AccountService;