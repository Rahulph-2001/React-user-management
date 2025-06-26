import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "./../redux/slices/userSlices";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const UserHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((state) => state.user);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Fetch profile on mount or when returning from update-profile page
    if (!user || location.state?.fromUpdate) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, location.state]);

  useEffect(() => {
    console.log("User data:", user);
    if (user?.profilepic) {
      console.log("Profile pic URL:", user.profilepic);
      const img = new Image();
      img.src = `${user.profilepic}?t=${Date.now()}`; // Cache-busting for image
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true);
    } else {
      setImageLoaded(true);
    }
  }, [user]);

  const handleEdit = () => {
    navigate("/user/update-profile");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/user/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md text-center border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">User Profile</h2>

        {loading || !imageLoaded ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-400 ml-3">Loading profile...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : user ? (
          <>
            <div className="flex justify-center">
              <img
                src={user.profilepic ? `${user.profilepic}?t=${Date.now()}` : "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-600 transition-transform duration-300 hover:scale-110"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
            </div>

            <p className="text-lg font-semibold text-white mt-4 border-b border-gray-600 pb-1">
              {user.name}
            </p>
            <p className="text-gray-400 border-b border-gray-600 pb-1 mt-3">
              {user.email}
            </p>
            <p className="text-gray-400 border-b border-gray-600 pb-1 mt-3">
              {user.mobile}
            </p>
          </>
        ) : (
          <p className="text-gray-400">No user data available</p>
        )}

        <div className="mt-6 space-x-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-7 py-2 bg-red-600 text-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-purple-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHome;