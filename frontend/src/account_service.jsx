import React, { useEffect, useState } from 'react';

const AccountService = (WrappedComponent) => {
  return (props) => {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
      const cachedUser = sessionStorage.getItem('user') ? sessionStorage.getItem('user') : localStorage.getItem('user');
      const user = JSON.parse(cachedUser);
      console.log(user);
      if (user) {
        setUserId(user.id);
        setUserName(user.userName);
      }
    }, []);

    return <WrappedComponent userId={userId} userName={userName} {...props} />;
  };
};

export default AccountService;