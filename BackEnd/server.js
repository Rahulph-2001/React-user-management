const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const connectDB=require('./config/db')
const cookieparser=require('cookie-parser')
const userRoutes=require('./routes/userRoutes')
const adminRoutes=require('./routes/adminRoutes')

dotenv.config();
connectDB()

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieparser())

app.use("/user",userRoutes)
app.use("/admin",adminRoutes)

app.get("/",(req,res)=>{
    res.send('User Management System')
})

const PORT=process.env.PORT||300;

app.listen(PORT,()=>console.log(`Server is Running on port ${PORT}`))



