// const express=require('express')
// const  {loginUser,registerUser, getUserProfile, updatedUserProfile, logoutUser,refreshToken}=require('../controllers/userController')
// const {userAuth}=require('../middleware/userAuth')
// const upload=require('../uploads/multer')

// const router=express.Router();

// router.post("/signUp", upload.single('profilepic'),registerUser)
// router.post("/login",loginUser)
// router.get("/profile",userAuth,getUserProfile);
// router.put("/update-profile",userAuth,upload.single('profilepic'),updatedUserProfile)
// router.post("/logout",userAuth,logoutUser)
// router.post("/refresh-token",refreshToken)




// module.exports=router




// routes/userRoutes.js
const express = require('express');
const { loginUser, registerUser, getUserProfile, updatedUserProfile, logoutUser, refreshToken } = require('../controllers/userController');
const { userAuth } = require('../middleware/userAuth');
const upload = require('../uploads/multer');

const router = express.Router();

// Add logging middleware for signup route
router.post("/signUp", 
    (req, res, next) => {
        console.log('=== SIGNUP ROUTE HIT ===');
        console.log('Request method:', req.method);
        console.log('Request URL:', req.url);
        console.log('Content-Type:', req.headers['content-type']);
        next();
    },
    upload.single('profilepic'),
    (req, res, next) => {
        console.log('=== AFTER MULTER MIDDLEWARE ===');
        console.log('Request body after multer:', req.body);
        console.log('Uploaded file after multer:', req.file);
        next();
    },
    registerUser
);

router.post("/login", loginUser);
router.get("/profile", userAuth, getUserProfile);
router.put("/update-profile", userAuth, upload.single('profilepic'), updatedUserProfile);
router.post("/logout", userAuth, logoutUser);
router.post("/refresh-token", refreshToken);

module.exports = router;