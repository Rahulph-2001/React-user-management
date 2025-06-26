import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "./../redux/slices/adminSlices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminLogin.css";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // === Validation Functions ===
  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "" : "Invalid email format";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    return value.length >= 6 ? "" : "Password must be at least 6 characters";
  };

  // === Handle Input Change ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    let error = "";
    if (name === "email") error = validateEmail(value);
    if (name === "password") error = validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // === Submit Login ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fix all validation errors");
      return;
    }

    try {
      const result = await dispatch(adminLogin(formData));
      if (result.type === "admin/login/fulfilled") {
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error(result.payload || "Invalid email or password");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Login error:", err);
    }
  };

  // === Reusable Input Field ===
  const renderInput = (type, name, placeholder, value, error) => (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`input-dark ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border bg-opacity-90 border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Admin Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {renderInput(
            "email",
            "email",
            "Email",
            formData.email,
            errors.email
          )}
          {renderInput(
            "password",
            "password",
            "Password",
            formData.password,
            errors.password
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
