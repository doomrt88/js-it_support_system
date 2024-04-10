import React, { useEffect, useState } from 'react';

const AccountService = (WrappedComponent) => {
  return (props) => {
    const [userId, setUserId] = useState('');

    useEffect(() => {
      const cachedUser = sessionStorage.getItem('user') ? sessionStorage.getItem('user') : localStorage.getItem('user');
      const user = JSON.parse(cachedUser);
      console.log(user);
      if (user) {
        setUserId(user.id);
      }
    }, []);

    return <WrappedComponent userId={userId} {...props} />;
  };
};

export default AccountService;