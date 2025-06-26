import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    profilepic: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    profilepic: ""
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (value.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/(?=.*[A-Z])/.test(value)) return "Must include an uppercase letter";
    if (!/(?=.*[0-9])/.test(value)) return "Must include a number";
    return "";
  };

  const validateMobile = (value) => {
    if (!value.trim()) return "Mobile number is required";
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(value)) return "Must be 10 digits";
    return "";
  };

  const handleChange = (e) => {
    if (e.target.name === "profilepic") {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, profilepic: "Max size 5MB" }));
          toast.error("File size should not exceed 5MB");
          return;
        }
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, profilepic: "Must be an image" }));
          toast.error("Please upload an image file");
          return;
        }
        setFormData({ ...formData, profilepic: file });
        setPreviewImage(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, profilepic: "" }));
      }
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      let validationError = "";
      switch (name) {
        case "name":
          validationError = validateName(value);
          break;
        case "email":
          validationError = validateEmail(value);
          break;
        case "password":
          validationError = validatePassword(value);
          break;
        case "mobile":
          validationError = validateMobile(value);
          break;
        default:
          break;
      }
      setErrors(prev => ({ ...prev, [name]: validationError }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      mobile: validateMobile(formData.mobile),
      profilepic: ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      toast.error("Please fix all validation errors");
      return;
    }

    const userData = new FormData();
    userData.append("name", formData.name);
    userData.append("email", formData.email);
    userData.append("password", formData.password);
    userData.append("mobile", formData.mobile);
    if (formData.profilepic) {
      userData.append("profilepic", formData.profilepic);
    }

    const loadingToast = toast.loading("Registering...");

    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      toast.dismiss(loadingToast);
      toast.success(result?.message || "Registration successful!");
      navigate("/user/login");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err || "Registration failed. Try again.");
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
            ${error ? 'border-red-500' : 'border-gray-600'} 
            rounded-lg focus:outline-none focus:border-purple-500 transition-colors
            [&:-webkit-autofill]:bg-transparent
            [&:-webkit-autofill]:text-white
            [&:-webkit-autofill]:[-webkit-text-fill-color:white]
            [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(55_65_81)_inset]
            appearance-none
          `}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm ml-1">{error}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="relative overflow-hidden w-full max-w-md">
        <div className="absolute inset-0 bg-gray-800 opacity-80 rounded-lg"></div>

        <div className="relative p-8 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            User Registration
          </h2>

          <div className="flex justify-center mb-6">
            <div className="relative group">
              <img
                src={previewImage || "https://dummyimage.com/150x150/ccc/ffffff&text=User"}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-600 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70">
                  <input
                    type="file"
                    name="profilepic"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>
            </div>
          </div>

          {errors.profilepic && (
            <p className="text-red-500 text-sm text-center mb-4">{errors.profilepic}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {renderInput("text", "name", "Name", formData.name, errors.name)}
              {renderInput("email", "email", "Email", formData.email, errors.email)}
              {renderInput("password", "password", "Password", formData.password, errors.password)}
              {renderInput("text", "mobile", "Mobile Number", formData.mobile, errors.mobile)}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
