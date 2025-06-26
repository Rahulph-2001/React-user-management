const User=require("../models/user")
const bcrypt=require("bcrypt")
const {generateToken,setCookie,verifyRefreshToken}=require('../utils/jwtUtils')
const user = require("../models/user")
require("dotenv").config()

const adminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const admin=await User.findOne({email,role:"admin"});

        if(!admin || !(await bcrypt.compare(password,admin.password))){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const{accessToken,refreshToken}=generateToken(admin)
        setCookie("AccessToken",accessToken,res)
        setCookie("RefreshToken",refreshToken,res)

        res.json({
            message:"Admin login successful",
            token:accessToken,
            admin:{
                id:admin._id,
                name:admin.name,
                email:admin.email,
                mobile:admin.mobile,
                role:admin.role
            }
        })
        
    } catch (error) {

        res.status(500).json({message:"Internal Server Error",error})
        
    }
}

const logoutAdmin=async(req,res)=>{
    res.cookie("token","",{httpOnly:true,expires:new Date(0)})
    res.json({message:"Admin Logged out Successfully"})
}

const getData=async(req,res)=>{
    try {
        const users=await User.find().select("-password")
        res.json(users)
        
    } catch (error) {
        res.status(500).json({message:"Internal Sever Error",error})
        
    }
}

const editUser=async(req,res)=>{
    try {

        const user=await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message:"User not Found"})

            console.log("User Data Sent to Frontend:", user);

            res.json(user);
            
        
    } catch (error) {
        res.status(500).json({message:"Internal Server Error",error})
        
    }
}

// const updateUser=async(req,res)=>{
//     try {

//         const userId=req.params.id;

//         if(!userId || userId=="undefined"){
//             return res.status(400).json({message:"User ID is Required"})
//         }

//         const {name,email,mobile}=req.body

//         const existingEmail=await User.findOne({
//             email,
//             _id:{$ne:userId}
//         })

//         if(existingEmail){
//             res.status(400).json({message:"Email Already Exist"})
//         }

//         const existingMobile=await User.findOne({mobile,_id:{$ne:userId}})
//         if(existingMobile){
//             return res.status(400).json({message:"Mobile Number already exists"})
//         }
//         const profilepic=req.file ? req.file.path.replace(/\\/g,"/"): undefined;

//         const updatedUser=await User.findByIdAndUpdate(req.params.id,
//             {name,email,mobile,...User(profilepic && {profilepic})},
//             {new:true,runValidators:true}
//         ).select("-password")

//         if(!updatedUser) return res.status(404).json({message:"User not Found"})
//             res.json({message:"User updated successfully",user:updatedUser})
        
//     } catch (error) {
        
//         console.error("Updated Use Error:",error)
//         res.status(500).json({message:"Internal Server Error",error})
//     }
// }

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "User ID is Required" });
    }

    const { name, email, mobile } = req.body;

    const existingEmail = await User.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    const existingMobile = await User.findOne({
      mobile,
      _id: { $ne: userId },
    });
    if (existingMobile) {
      return res.status(400).json({ message: "Mobile Number Already Exists" });
    }

    const updateData = {
      name,
      email,
      mobile,
    };

    // Handle profile picture from Cloudinary
    if (req.file) {
      console.log("Cloudinary file:", req.file); // Debug log
      updateData.profilepic = req.file.path; // Cloudinary URL
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not Found" });
    }

    console.log("Updated user:", updatedUser); // Debug log
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const profilepic = req.file ? req.file.path : undefined;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExistingEmail = await User.findOne({ email });
    if (userExistingEmail) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const userExistingByMobile = await User.findOne({ mobile });
    if (userExistingByMobile) {
      return res.status(400).json({ message: "User already exists with this mobile number" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      profilepic,
    });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      profilepic: newUser.profilepic,
      role: newUser.role,
    };

    res.status(201).json({ message: "User created successfully", newUser: userResponse });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser=async(req,res)=>{
    try {
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({message:"User not Found"})

            res.json({message:"User deleted Successfully"})
        
    } catch (error) {

        res.status(500).json({message:"Internal Server Error",error})
        
    }
}

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Assuming refresh token is in cookie
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
    setCookie('accessToken', accessToken, res);
    setCookie('refreshToken', newRefreshToken, res);

    res.status(200).json({ token: accessToken }); // Return access token for frontend
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports={adminLogin,logoutAdmin,getData,editUser,updateUser,createUser,deleteUser,refreshToken}