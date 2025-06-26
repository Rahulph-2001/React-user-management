import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import {logoutAdmin} from'../../components/redux/slices/adminSlices'

export const UserProtectedRoute = ({ children }) => {
  const { user, token, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user  || !token) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }) => {
//   const dispatch = useDispatch();
  const { admin, token, loading } = useSelector((state) => state.admin);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-700 text-lg">Loading...</p>
//         </div>
//       </div>
//     );
//   }

  if (!admin || !token) {
    // localStorage.removeItem("adminToken");
    // localStorage.removeItem("adminData");
    // dispatch(logoutAdmin());
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};