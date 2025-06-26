const express=require('express')

const {adminLogin,logoutAdmin,getData,editUser,updateUser,createUser,deleteUser, refreshToken}=require('../controllers/adminController')
const adminAuth=require('../middleware/adminAuth')
const upload=require('../uploads/multer')
const router=express.Router();


router.post("/login",adminLogin)
router.post("/logout",logoutAdmin)

router.get("/users",adminAuth,getData)
router.get("/edit-user/:id",adminAuth,editUser)
router.put("/update-user/:id",upload.single("profilepic"),adminAuth,updateUser)
router.post("/create-user",adminAuth,upload.single("profilepic"),createUser)
router.delete("/delete-user/:id",adminAuth,deleteUser)
router.post("/refresh-token",refreshToken)

module.exports=router