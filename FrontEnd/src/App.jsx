import './index.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PublicRoutes, { AdminPublic } from "../../FrontEnd/src/components/routes/PublicRoutes";
import { UserProtectedRoute, AdminProtectedRoute } from "../src/components/routes/ProtectedRote";

// Admin
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import CreateUser from "./components/Dashboard/CreateUser";
import AdminLogin from "./components/Login/adminLogin";
import EditUser from "./components/Dashboard/EditUser";

// User
import Register from "../../FrontEnd/src/components/Register/Rejister";
import UserLogin from "./../src/components/Login/userLogin";
import UserHome from "./components/Home/userHome";
import UserEditProfile from "../../FrontEnd/src/components/Home/userEditProfile";

import NotFound from "./components/NotFound";

// const App = () => {
//   const user = useSelector((state) => state.user?.user);
//   const admin = useSelector((state) => state.admin?.admin);

//   return (
//     <Router>
//       <ToastContainer position="top-left" autoClose={1500} theme="dark" />

//       <Routes>
//         {/* Root Redirect */}
//         <Route
//           path="/"
//           element={
//             admin ? <Navigate to="/admin/dashboard" /> :
//             user ? <Navigate to="/user/profile" /> :
//             <Navigate to="/user/login" />
//           }
//         />

//         {/* Public Auth Routes */}
//         <Route path="/user/login" element={<PublicRoutes><UserLogin /></PublicRoutes>} />
//         <Route path="/user/register" element={<PublicRoutes><Register /></PublicRoutes>} />
//         <Route path="/admin/login" element={<PublicRoutes><AdminLogin /></PublicRoutes>} />

//         {/* User Protected Routes */}
//         <Route path="/user/profile" element={<UserProtectedRoute><UserHome /></UserProtectedRoute>} />
//         <Route path="/user/update-profile" element={<UserProtectedRoute><UserEditProfile /></UserProtectedRoute>} />

//         {/* Admin Protected Routes */}
//         <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
//         <Route path="/admin/create-user" element={<AdminProtectedRoute><CreateUser /></AdminProtectedRoute>} />
//         <Route path="/admin/edit-user/:id" element={<AdminProtectedRoute><EditUser /></AdminProtectedRoute>} />

//         {/* 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

const App = () => {
  const user = useSelector((state) => state.user?.user);
  const admin = useSelector((state) => state.admin?.admin);

  return (
    <Router>
      <ToastContainer position="top-left" autoClose={1500} theme="dark" />
      <Routes>
        <Route
          path="/"
          element={
            admin ? <Navigate to="/admin/dashboard" /> :
            user ? <Navigate to="/user/profile" /> :
            <Navigate to="/user/login" />
          }
        />
        <Route path="/user/login" element={<PublicRoutes><UserLogin /></PublicRoutes>} />
        <Route path="/user/register" element={<PublicRoutes><Register /></PublicRoutes>} />
        <Route path="/admin/login" element={<AdminPublic><AdminLogin /></AdminPublic>} />
        <Route path="/user/profile" element={<UserProtectedRoute><UserHome /></UserProtectedRoute>} />
        <Route path="/user/update-profile" element={<UserProtectedRoute><UserEditProfile /></UserProtectedRoute>} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/create-user" element={<AdminProtectedRoute><CreateUser /></AdminProtectedRoute>} />
        <Route path="/admin/edit-user/:id" element={<AdminProtectedRoute><EditUser /></AdminProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;