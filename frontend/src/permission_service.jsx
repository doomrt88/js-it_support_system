import React, { useEffect, useState } from 'react';
import axios from './axios_interceptor';

const PermissionService = (WrappedComponent) => {
    return (props) => {
        const [permissions, setPermissions] = useState([]);

        useEffect(() => {
            const fetchUserPermissions = async () => {
                if(props?.userId){
                try {
                    const response = await axios.get(`/users/${props.userId}/permissions`);
                    
                    const userPermissions = response.data || [];
                    setPermissions(userPermissions);
                    console.log(userPermissions);
                } catch (error) {
                    console.error("Error fetching user permissions:", error);
                }
              }
            };
            fetchUserPermissions();
        }, [props.userId]);

        return <WrappedComponent permissions={permissions} {...props} />;
    };
};

export default PermissionService;
