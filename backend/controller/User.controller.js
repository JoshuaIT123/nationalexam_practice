import User from '../model/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req,res) =>{
    try {
        const {name,email,password} = req.body;
        const hashedPassord = await bcrypt.hash(password,10)
        const user = await User.create({name:name,email:email,password:hashedPassord})

        res.status(201).json({"message":"User has been registered successfully"})
    } catch (error) {
        res.status(500).json({"message":"User not registered",error:error.message})
        
    }
}

export const loginUser = async (req,res) =>{
    try {
        const {email,password} = req.body;
        const userExist = await User.findOne({email})
        if(!userExist) return res.status(404).json({"message":"User not found"})
        const isMatch = await bcrypt.compare(password,userExist.password)
         if(!isMatch) return res.status(404).json({"message":"Wrong Password"})
        const token  = jwt.sign({userId_:userExist._id},process.env.JWT_SECRET,{expiresIn:"2d"})
            res.status(200).json({"message":"User logged In ",token})
         } catch (error) {
        res.status(500).json(error.message)
    }
}