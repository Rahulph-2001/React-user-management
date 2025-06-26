import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "./../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Validation functions
  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Inline validation
    let validationError = "";
    if (name === "email") validationError = validateEmail(value);
    if (name === "password") validationError = validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      const result = await dispatch(userLogin(formData)).unwrap();

      // Handle admin case
      if (result.user.role === "admin") {
        toast.error("Access denied. Please login via admin page.");
        navigate("/admin/login");
        return;
      }

      toast.success("Login successful!");
      navigate("/user/profile");
    } catch (err) {
      toast.error(err || "Login failed. Please try again.");
    }
  };

  const renderInput = (type, name, placeholder, value, error) => (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gray-700 opacity-95 rounded-lg"></div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required
          className={`
            relative w-full p-3 bg-transparent text-white border 
            ${error ? "border-red-500" : "border-gray-600"} 
            rounded-lg focus:outline-none focus:border-purple-500 transition-colors
            [&:-webkit-autofill]:bg-transparent
            [&:-webkit-autofill]:text-white
            [&:-webkit-autofill]:[-webkit-text-fill-color:white]
            [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(55_65_81)_inset]
            appearance-none
          `}
        />
      </div>
      {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">User Login</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {renderInput("email", "email", "Email", formData.email, errors.email)}
            {renderInput("password", "password", "Password", formData.password, errors.password)}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center justify-center gap-16 text-gray-400 mt-4">
            <a
              href="/user/register"
              className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-400 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 cursor-pointer"
            >
              Don't have an account? Register
            </a>
            <a
              href="/admin/login"
              className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-400 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 cursor-pointer"
            >
              Admin Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
