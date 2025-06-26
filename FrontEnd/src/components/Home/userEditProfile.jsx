// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateUserProfile } from "./../redux/slices/userSlices";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const UserEditProfile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, loading: reduxLoading, error: reduxError } = useSelector((state) => state.user);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [profilepic, setProfilePic] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     profilepic: "",
//   });

//   useEffect(() => {
//     console.log("User state:", user); // Debug user state
//     if (user) {
//       setName(user.name || "");
//       setEmail(user.email || "");
//       setMobile(user.mobile || "");
//       // Only set preview if user.profilepic is a valid string
//       if (user.profilepic && typeof user.profilepic === "string" && user.profilepic.trim()) {
//         const baseUrl = import.meta.env.VITE_USER_URL || "http://localhost:5000";
//         const profilePicUrl = user.profilepic.startsWith("http")
//           ? user.profilepic
//           : `${baseUrl}/${user.profilepic.replace(/\\/g, "/")}`;
//         console.log("Setting preview URL:", profilePicUrl); // Debug
//         setPreview(profilePicUrl);
//       } else {
//         console.log("No valid user.profilepic, using fallback"); // Debug
//         setPreview("https://via.placeholder.com/128");
//       }
//     }
//   }, [user]);

//   // Validation functions
//   const validateName = (value) =>
//     !value.trim() ? "Name is required" : 
//     value.length < 2 ? "Name must be at least 2 characters" : "";

//   const validateEmail = (value) =>
//     !value.trim() ? "Email is required" : 
//     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";

//   const validateMobile = (value) =>
//     !value.trim() ? "Mobile number is required" : 
//     !/^[0-9]{10}$/.test(value) ? "Invalid mobile number (10 digits required)" : "";

//   // Field handlers
//   const handleInput = (setter, validator, field) => (e) => {
//     const value = e.target.value;
//     setter(value);
//     setErrors((prev) => ({ ...prev, [field]: validator(value) }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors((prev) => ({ ...prev, profilepic: "File size should not exceed 5MB" }));
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         setErrors((prev) => ({ ...prev, profilepic: "Please upload an image file" }));
//         return;
//       }
//       setProfilePic(file);
//       setPreview(URL.createObjectURL(file));
//       setErrors((prev) => ({ ...prev, profilepic: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {
//       name: validateName(name),
//       email: validateEmail(email),
//       mobile: validateMobile(mobile),
//       profilepic: errors.profilepic,
//     };

//     setErrors(newErrors);
//     if (Object.values(newErrors).some((err) => err)) {
//       toast.error("Please fix all errors before submitting");
//       return;
//     }

//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("mobile", mobile);
//     if (profilepic) formData.append("profilepic", profilepic);

//     try {
//       console.log("Submitting profile update..."); // Debug
//       const result = await dispatch(updateUserProfile(formData));
//       console.log("Update result:", result); // Debug
//       if (!result.error) {
//         toast.success("Profile updated successfully!");
//         // navigate("/user/profile");
//       } else {
//         toast.error(result.payload || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Update profile error:", error); // Debug
//       toast.error("An unexpected error occurred during profile update");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle invalid user state
//   if (!user && reduxLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
//         <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//         <p className="text-white mt-4">Loading user data...</p>
//       </div>
//     );
//   }

//   if (!user && reduxError) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
//         <p className="text-red-500">Error loading user data: {reduxError}</p>
//         <button
//           onClick={() => navigate("/login")}
//           className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 relative">
//       {/* Full-screen loading overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
//           <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//           <p className="text-white ml-4 text-lg">Updating profile...</p>
//         </div>
//       )}

//       <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-700">
//         <h2 className="text-2xl font-bold mb-6 text-white text-center">Edit Profile</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Profile Picture Upload */}
//           <div className="flex flex-col items-center mb-6">
//             <div className="relative group">
//               <img
//                 src={preview || (user?.profilepic && user.profilepic.trim() ? user.profilepic : "https://via.placeholder.com/128")}
//                 alt="Profile Preview"
//                 className="w-32 h-32 rounded-full object-cover border-2 border-gray-600 transition-transform duration-300 group-hover:scale-110"
//                 onError={(e) => {
//                   console.error("Image load error, URL:", e.target.src); // Debug specific URL
//                   e.target.src = "https://via.placeholder.com/128"; // Fallback on error
//                 }}
//               />
//               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                 <label className="cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     disabled={isLoading}
//                   />
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </label>
//               </div>
//             </div>
//             {errors.profilepic && <p className="text-red-500 text-sm mt-2">{errors.profilepic}</p>}
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <input
//                 type="text"
//                 value={name}
//                 onChange={handleInput(setName, validateName, "name")}
//                 placeholder="Name"
//                 className={`w-full p-3 bg-gray-700 text-white border ${errors.name ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
//                 disabled={isLoading}
//               />
//               {errors.name && <p className="text-red-500 text-sm ml-1">{errors.name}</p>}
//             </div>

//             <div className="space-y-2">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={handleInput(setEmail, validateEmail, "email")}
//                 placeholder="Email"
//                 className={`w-full p-3 bg-gray-700 text-white border ${errors.email ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
//                 disabled={isLoading}
//               />
//               {errors.email && <p className="text-red-500 text-sm ml-1">{errors.email}</p>}
//             </div>

//             <div className="space-y-2">
//               <input
//                 type="text"
//                 value={mobile}
//                 onChange={handleInput(setMobile, validateMobile, "mobile")}
//                 placeholder="Mobile Number"
//                 className={`w-full p-3 bg-gray-700 text-white border ${errors.mobile ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
//                 disabled={isLoading}
//               />
//               {errors.mobile && <p className="text-red-500 text-sm ml-1">{errors.mobile}</p>}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex space-x-4 pt-4">
//             <button
//               type="submit"
//               className={`flex-1 py-3 text-white rounded-lg transition-all duration-300 ${
//                 isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
//               }`}
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating..." : "Update Profile"}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate("/user/profile")}
//               className="flex-1 py-3 bg-red-600 text-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-purple-500"
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserEditProfile;




import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserEditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: reduxLoading, error: reduxError } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilepic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    profilepic: "",
  });

  useEffect(() => {
    console.log("User state:", user);
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setMobile(user.mobile || "");
      if (user.profilepic && typeof user.profilepic === "string" && user.profilepic.trim()) {
        const baseUrl = import.meta.env.VITE_USER_URL || "http://localhost:5000";
        const profilePicUrl = user.profilepic.startsWith("http")
          ? user.profilepic
          : `${baseUrl}/${user.profilepic.replace(/\\/g, "/")}`;
        console.log("Setting preview URL:", profilePicUrl);
        setPreview(profilePicUrl);
      } else {
        console.log("No valid user.profilepic, using fallback");
        setPreview("https://via.placeholder.com/128");
      }
    }
  }, [user]);

  const validateName = (value) =>
    !value.trim() ? "Name is required" : 
    value.length < 2 ? "Name must be at least 2 characters" : "";

  const validateEmail = (value) =>
    !value.trim() ? "Email is required" : 
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";

  const validateMobile = (value) =>
    !value.trim() ? "Mobile number is required" : 
    !/^[0-9]{10}$/.test(value) ? "Invalid mobile number (10 digits required)" : "";

  const handleInput = (setter, validator, field) => (e) => {
    const value = e.target.value;
    setter(value);
    setErrors((prev) => ({ ...prev, [field]: validator(value) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profilepic: "File size should not exceed 5MB" }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, profilepic: "Please upload an image file" }));
        return;
      }
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profilepic: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      mobile: validateMobile(mobile),
      profilepic: errors.profilepic,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    if (profilepic) formData.append("profilepic", profilepic);

    try {
      console.log("Submitting profile update...");
      const startTime = Date.now();
      console.log('redux state',reduxLoading)
      const result = await dispatch(updateUserProfile(formData));
      console.log('redux state',reduxLoading)
      const duration = Date.now() - startTime;
      console.log(`Update completed in ${duration}ms`, result);

      if (!result.error) {
        toast.success("Profile updated successfully!");
        // Delay navigation to ensure toast is visible
        setTimeout(() => navigate("/user/profile"), 500);
      } else {
        toast.error(result.payload || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("An unexpected error occurred during profile update");
    } finally {
      setIsLoading(false);
    }
  };

  // if (!user && reduxLoading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
  //       <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
  //       <p className="text-white mt-4">Loading user data...</p>
  //     </div>
  //   );
  // }

  // if (!user && reduxError) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
  //       <p className="text-red-500">Error loading user data: {reduxError}</p>
  //       <button
  //         onClick={() => navigate("/login")}
  //         className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  //       >
  //         Go to Login
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={preview || (user?.profilepic && user.profilepic.trim() ? user.profilepic : "https://via.placeholder.com/128")}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-600 transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  console.error("Image load error, URL:", e.target.src);
                  e.target.src = "https://via.placeholder.com/128";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
            </div>
            {errors.profilepic && <p className="text-red-500 text-sm mt-2">{errors.profilepic}</p>}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={handleInput(setName, validateName, "name")}
                placeholder="Name"
                className={`w-full p-3 bg-gray-700 text-white border ${errors.name ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
                disabled={isLoading}
              />
              {errors.name && <p className="text-red-500 text-sm ml-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={handleInput(setEmail, validateEmail, "email")}
                placeholder="Email"
                className={`w-full p-3 bg-gray-700 text-white border ${errors.email ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={mobile}
                onChange={handleInput(setMobile, validateMobile, "mobile")}
                placeholder="Mobile Number"
                className={`w-full p-3 bg-gray-700 text-white border ${errors.mobile ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
                disabled={isLoading}
              />
              {errors.mobile && <p className="text-red-500 text-sm ml-1">{errors.mobile}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className={`flex-1 py-3 text-white rounded-lg transition-all duration-300 flex items-center justify-center ${
                isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/user/profile")}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-purple-500"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditProfile;