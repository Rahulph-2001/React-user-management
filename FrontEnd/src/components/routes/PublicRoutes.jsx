import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoutes = ({ children }) => {
    const { user, token: userToken } = useSelector((state) => state.user);

    
    // If user is logged in, redirect to user dashboard
    if (user && userToken) {
        return <Navigate to="/user/profile" replace />;
    }

    return children;
};

export default PublicRoutes;

export const AdminPublic = ({children}) => {
        const { admin, token: adminToken } = useSelector((state) => state.admin);
        console.log(admin,adminToken)
    if (admin && adminToken) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
}





