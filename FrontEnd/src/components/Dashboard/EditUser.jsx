import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateUser, getUserForEdit } from './../redux/slices/adminSlices';
import { toast } from "react-toastify";
import { User } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userForEdit, loading } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilepic: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error("User ID is missing");
      navigate("/admin/dashboard");
      return;
    }
    dispatch(getUserForEdit(id));
  }, [dispatch, id, navigate]);

  useEffect(() => {
    if (userForEdit) {
      setFormData({
        name: userForEdit.name || "",
        email: userForEdit.email || "",
        mobile: userForEdit.mobile || "",
        profilepic: userForEdit.profilepic || "",
      });
      if (userForEdit.profilepic && !selectedFile) {
        setPreview(userForEdit.profilepic);
      }
    }
  }, [userForEdit, selectedFile]);
  const validateField = (name, value) => {
    const error = {};
    switch (name) {
      case "name":
        if (!value.trim()) error.name = "Name is required";
        else if (value.length < 2) error.name = "Name must be at least 2 characters";
        else if (value.length > 50) error.name = "Name must not exceed 50 characters";
        else if (!/^[a-zA-Z\s]*$/.test(value)) error.name = "Only letters and spaces allowed";
        break;
      case "email":
        if (!value.trim()) error.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error.email = "Invalid email format";
        break;
      case "mobile":
        if (!value.trim()) error.mobile = "Mobile number is required";
        else if (!/^\d{10}$/.test(value)) error.mobile = "Must be 10 digits";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr[name] || "" }));
  };

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setIsDirty(true);
  if (file.size > MAX_FILE_SIZE) {
    setErrors((prev) => ({ ...prev, profilepic: "Max file size is 5MB" }));
    toast.error("Max file size is 5MB");
    return;
  }
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    setErrors((prev) => ({ ...prev, profilepic: "Only JPEG and PNG files allowed" }));
    toast.error("Only JPEG and PNG files allowed");
    return;
  }
  setSelectedFile(file);
  const reader = new FileReader();
  reader.onloadend = () => setPreview(reader.result);
  reader.readAsDataURL(file);
  setErrors((prev) => ({ ...prev, profilepic: "" }));
};

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "profilepic") {
        Object.assign(newErrors, validateField(key, formData[key]));
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }
    if (!isDirty && !selectedFile) {
      toast.info("No changes to update");
      return;
    }
    setIsSubmitting(true);
    const updatedData = new FormData();
    if (formData.name !== userForEdit.name) updatedData.append("name", formData.name);
    if (formData.email !== userForEdit.email) updatedData.append("email", formData.email);
    if (formData.mobile !== userForEdit.mobile) updatedData.append("mobile", formData.mobile);
    if (selectedFile) updatedData.append("profilepic", selectedFile);

    try {
      await dispatch(updateUser({ id, updatedData })).unwrap();
      toast.success("User updated successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="h-12 w-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Edit User</h2>

        <div className="flex justify-center mb-6">
          <div className="relative group">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full border-2 border-gray-600"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-600 rounded-full">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <label className="cursor-pointer p-2 bg-black bg-opacity-50 rounded-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>
          </div>
        </div>
        {errors.profilepic && <p className="text-red-500 text-sm text-center mb-2">{errors.profilepic}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'email', 'mobile'].map((field) => (
            <div key={field}>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-700 text-white border rounded-lg focus:outline-none focus:border-purple-500 ${errors[field] ? 'border-red-500' : 'border-gray-600'
                  }`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || (!isDirty && !selectedFile)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-gradient-to-r from-purple-500 to-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Updating...
                </div>
              ) : (
                "Update User"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-gradient-to-r from-red-500 to-purple-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;