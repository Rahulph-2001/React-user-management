import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUser,
  getUserForEdit,
  logoutAdmin,
} from "./../redux/slices/adminSlices";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogOut, Edit, Trash2, User, Search } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      dispatch(logoutAdmin());
      navigate("/admin/login");
    } else {
      dispatch(fetchAllUsers()).unwrap().catch((err) => {
        if (err.includes("401") || err.includes("Unauthorized")) {
          dispatch(logoutAdmin());
          navigate("/admin/login");
        }
      });
    }
  }, [dispatch, navigate]);

  const handleDelete = async (userId) => {
    const loadingToast = toast.loading("Deleting user...");
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.dismiss(loadingToast);
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Delete user error:", err);
      toast.error(err || "Failed to delete user");
    }
  };

  const handleEdit = (userId) => {
    if (!userId) {
      console.error("Error: userId is undefined");
      return;
    }
    dispatch(getUserForEdit(userId));
    navigate(`/admin/edit-user/${userId}`);
  };

  const handleCreateUser = () => {
    navigate("/admin/create-user");
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  const filteredUsers = users.filter((user) => {
    const searchString = searchTerm.toLowerCase();
    return (
      user.role !== "admin" &&
      (user.name?.toLowerCase().includes(searchString) ||
        user.email?.toLowerCase().includes(searchString) ||
        user.mobile?.toLowerCase().includes(searchString))
    );
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <div className="space-y-4">
            <button
              onClick={handleCreateUser}
              className="inline-flex items-center w-full px-4 py-2 text-white rounded-lg transition-all duration-300 bg-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center w-full px-4 py-2 text-white rounded-lg transition-all duration-300 bg-red-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search users by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id || index}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center">
                          <div className="group relative w-10 h-10 flex-shrink-0">
                            {user.profilepic ? (
                              <img
                                src={user.profilepic}
                                alt="Profile"
                                className="h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-150 cursor-pointer"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/150";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-400">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400">{user.email}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          {user.mobile}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user._id)}
                            className="inline-flex items-center px-4 py-2 text-white rounded-lg bg-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="inline-flex items-center px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-purple-500"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center">
                      <div className="text-gray-400">
                        <User className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                        <p className="text-lg">No users found</p>
                        <p className="text-sm text-gray-500">
                          Try adjusting your search
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;