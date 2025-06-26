const jwt=require('jsonwebtoken')

const generateToken=(user)=>{
    const accessToken=jwt.sign(
        {id:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"15m"}
    )
    
    const refreshToken=jwt.sign(
        {id:user._id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:"7d"}
    )

    return {accessToken,refreshToken}
}

const verifyAccessToken=(token)=>{
    try{
        return jwt.verify(token,process.env.JWT_SECRET)
    }catch(error){
        return null
    }
}

const verifyRefreshToken=(token)=>{
    try {

        return jwt.verify(token,process.env.JWT_REFRESH_SECRET)
        
    } catch (error) {
        return (null)
    }
}

const setCookie=(name,token,res)=>{
    res.cookie(name,token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict"
        })
}

module.exports={generateToken,verifyAccessToken,verifyRefreshToken,setCookie}