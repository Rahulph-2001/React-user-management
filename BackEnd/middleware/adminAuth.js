const {verifyAccessToken}=require('../utils/jwtUtils')

const adminAuth=(req,res,next)=>{
    const authHeader=req.header("Authorization")
    const token=authHeader ?.startsWith('Bearer ') ? authHeader.split(" ")[1]:null
    if(!token) return res.status(401).json({message:"Not Authorized, No Token"})
         
        let decoded
        try {
            decoded=verifyAccessToken(token)
            
        } catch (error) {

            return res.status(401).json({message:"Invalid or Expired"})
            
        }
        if(!decoded){
            return res.status(401).json({message:"Invalid or Token Expired"})
        }
        if(decoded.role !=="admin"){
            return res.status(403).json({message:"Access Denied : Admin Only"})
        }
        req.user=decoded
        next()
}
module.exports=adminAuth