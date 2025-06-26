require("dotenv").config()
const User=require('../models/user')
const bcrypt=require('bcrypt')
const {generateToken,setCookie,verifyRefreshToken}=require('../utils/jwtUtils')


const securePassword=async(password)=>{
    try {
        return await bcrypt.hash(password,10);
        
    } catch (error) {
        console.log(error);
        throw new Error('Password hashing Failed')
        
    }
}

// const registerUser=async(req,res)=>{
//     try {
//         const {name,email,password,mobile}=req.body;
//         const profilepic=req.file ? req.file.path:undefined;
//         if(!name || !email || !password || !mobile){
//             return res.status(400).json({message:"All fields are required",error})
//         }
//         const userExist=await User.findOne({$or:[{email},{mobile}]})
//         if(userExist){
//             if(userExist.email==email){
//                 return res.status(400).json({message:"User with this email already exist"})
//             }
//             if(userExist.mobile==mobile){
//                 return res.status(400).json({message:'User with This Mobile Already exist'})
//             }
//         }
//         const hashedPassword=await securePassword(password)
//         const newUser=await User.create({
//             name,
//             email,
//             mobile,
//             password:hashedPassword,
//             profilepic,
//             role:'user'
//         })
//         res.status(201).json({message:"User registered SuccessFully"})
        
//     } catch (error) {
//         console.error('Error in Register:',error)
//         res.status(500).json({message:'Internal Server Error',error})
        
//     }
// }

// controllers/userController.js
const registerUser = async (req, res) => {
    try {
        console.log('=== REGISTRATION DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);
        console.log('File path (if uploaded):', req.file?.path);
        console.log('Cloudinary URL (if uploaded):', req.file?.secure_url);
        
        const { name, email, password, mobile } = req.body;
        
        // Validate required fields
        if (!name || !email || !password || !mobile) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Prepare user data
        const userData = {
            name,
            email,
            password: hashedPassword,
            mobile,
            // Add profile picture URL if file was uploaded
            profilepic: req.file ?.path || null
        };
        
        console.log('User data to save:', userData);
        
        // Create new user
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        
        console.log('Saved user:', savedUser);
        
        // Generate JWT token (if needed)
        // const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                mobile: savedUser.mobile,
                profilepic: savedUser.profilepic
            }
            // token: token (if you want to auto-login after registration)
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

const loginUser=async(req,res)=>{
    try {

        const {email,password}=req.body;
        const user=await User.findOne({email})

        if(user.role=='admin'){
            return res.status(401).json({message:'admin login is not permitted.'})
        }
        if(!user|| !(await bcrypt.compare(password,user.password))){
            return res.status(400).json({message:'Invalid Credentials'})
        }
        const {accessToken,refreshToken}=generateToken(user)

        setCookie("AccessToken",accessToken,res)
        setCookie("RefreshToken",refreshToken,res)

        res.json({
            message:"Login Successful!",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                mobile:user.mobile,
                role:user.role,
                profilepic:user.profilepic
            },
             token: accessToken
        })
        
    } catch (error) {
        console.log('Login Error',error)
        res.status(500).json({message:'Internal Server Error'})
        
    }
}

const getUserProfile=async(req,res)=>{
    const user=await User.findById(req.user.id).select("-password")
    if(!user) return res.status(404).json({message:"User Not Found"})
        res.json(user)
}

const logoutUser=async(req,res)=>{
    res.cookie("token","",{httpOnly:true,expires:new Date(0)})
    res.json({message:'User Logged out Successfully'})
}

const updatedUserProfile=async(req,res)=>{
    const {name,mobile,email}=req.body;

    const profilepic=req.file ? req.file.path : undefined;

    const existingUser=await User.findById(req.user.id);
    const existingUserEmail=await User.findOne({email:req.body.email})
    if(existingUserEmail && existingUserEmail._id.toString()!==req.user.id){
        return res.status(400).json({message:"Email already Exist"})
    }

    const existingUserMobile=await User.findOne({mobile:req.body.mobile})
    if(existingUserMobile && existingUserMobile._id.toString() !==req.user.id){
        return res.status(400).json({message:"Mobile number alreaady exists"})
    }
    if(!existingUser){
        return res.status(404).json({message:"User not found"})
    }

    const updatedUser=await User.findByIdAndUpdate(
        req.user.id,
        {name,mobile,email,...(profilepic && {profilepic})},
        {new:true,runValidators:true}
    ).select("-password");

    res.json(updatedUser)
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

module.exports = { loginUser, registerUser, getUserProfile, updatedUserProfile, logoutUser, refreshToken };

