import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from './../redux/slices/adminSlices';
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    mobile: "",
    profilepic: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const validate = {
    name: (value) => !value.trim() ? "Name is required" : value.length < 2 ? "Name must be at least 2 characters" : "",
    email: (value) => !value.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "",
    password: (value) => !value ? "Password is required" : value.length < 6 ? "Password must be at least 6 characters" :
      !/(?=.*[A-Z])/.test(value) ? "Password must contain at least one uppercase letter" :
        !/(?=.*[0-9])/.test(value) ? "Password must contain at least one number" : "",
    mobile: (value) => !value.trim() ? "Mobile number is required" : !/^[0-9]{10}$/.test(value) ? "Invalid mobile number (10 digits required)" : ""
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilepic") { // Changed from profilePic
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, profilepic: "File size should not exceed 5MB" }));
          toast.error("File size should not exceed 5MB");
          return;
        }
        if (!["image/jpeg", "image/png"].includes(file.type)) { // Align with backend
          setErrors((prev) => ({ ...prev, profilepic: "Only JPEG and PNG files allowed" }));
          toast.error("Only JPEG and PNG files allowed");
          return;
        }
        setFormData((prev) => ({ ...prev, profilepic: file }));
        setPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, profilepic: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (validate[name]) {
        setErrors((prev) => ({ ...prev, [name]: validate[name](value) }));
      }
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {
    name: validate.name(formData.name),
    email: validate.email(formData.email),
    password: validate.password(formData.password),
    mobile: validate.mobile(formData.mobile),
    profilepic: errors.profilepic || "",
  };
  setErrors(newErrors);
  if (Object.values(newErrors).some((err) => err !== "")) {
    toast.error("Please fix all validation errors before submitting");
    return;
  }

  const userData = new FormData();
  Object.entries(formData).forEach(([key, val]) => {
    if (val !== null) userData.append(key, val);
  });

  // Log FormData contents
  for (let [key, value] of userData.entries()) {
    console.log(`${key}:`, value);
  }

  const loadingToast = toast.loading("Creating user...");
  try {
    const res = await dispatch(createUser(userData)).unwrap();
    toast.dismiss(loadingToast);
    toast.success("User created successfully!");
    navigate("/admin/dashboard");
  } catch (err) {
    toast.dismiss(loadingToast);
    console.error("Create user error:", err);
    toast.error(err || "Failed to create user");
  }
};
  const renderInput = (type, name, placeholder, value, error) => (
    <div className="space-y-2">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
        className={`w-full p-3 bg-gray-800 text-white border ${error ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:border-purple-500`}
      />
      {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Create User</h2>
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <img
              src={preview || "https://dummyimage.com/150x150/ccc/ffffff&text=User"}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
              <input type="file" name="profilepic" accept="image/jpeg,image/png" onChange={handleChange} className="hidden" />              
              <UserPlus className="text-white w-6 h-6" />
            </label>
          </div>
        </div>
        {errors.profilepic && <p className="text-red-500 text-sm text-center mb-4">{errors.profilepic}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {renderInput("text", "name", "Name", formData.name, errors.name)}
          {renderInput("email", "email", "Email", formData.email, errors.email)}
          {renderInput("password", "password", "Password", formData.password, errors.password)}
          {renderInput("text", "mobile", "Mobile Number", formData.mobile, errors.mobile)}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : (
                <><UserPlus className="w-5 h-5 mr-2" />Create</>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-red-500 hover:to-purple-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
