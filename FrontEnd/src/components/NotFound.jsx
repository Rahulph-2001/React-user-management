import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



const NotFound = () => {

  const {user} = useSelector((state) => state.user)
  const {admin} = useSelector((state) => state.admin)

  const navigate = useNavigate()

  const handleNavigate = () => {
    // if (user) {
    //   navigate("/user/profile")
    // }
    // if(admin){
    //   navigate("/admin/dashboard")
    // }
    navigate (-1)
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-gray-400 mt-2">Oops! The page you're looking for doesn't exist.</p>
      <img
        src="https://dummyimage.com/400x300/444/ffffff&text=Lost+in+Space"
        alt="404 Illustration"
        className="w-80 mt-4 rounded-lg shadow-lg"
      />

      <button
        onClick={handleNavigate}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg transition-all duration-300 hover:bg-blue-500"
      >
        Go Home
      </button>

    </div>
  );
};

export default NotFound;
