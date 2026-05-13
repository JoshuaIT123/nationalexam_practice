import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export  const  registerUser= async (req, res) => {
   try {
      const { name,email, password } = req.body;
      if(!name || !email || !password){
         return res.status(400).json({"message":"All fields are required"})
      }
      const userExist = await User.findOne({email})
      if(userExist){
         return res.status(400).json({"message":"Email already exists"})
      }
      const hashedPassword = await bcryptjs.hash(password, 10)
      const USER = await User.create({
         name: name,
         email:email,
         password: hashedPassword
      });
      return res.status(201).json({ "message": "User has been registered successfully" })
   } catch (err) {
      res.status(500).json({"message":"Failed to register a user"})
   }
}

export const  loginUser =  async (req, res) => {
   try {
      const { email, password } = req.body;
      const userExist = await User.findOne({email });
       if (!userExist) {
          return res.status(404).json({ "message": "Invalid credentials" })
       }

       const isMatch = await bcryptjs.compare(password, userExist.password);
       if (!isMatch) {
          return res.status(404).json({ "message": "Wrong password" })
       }

       const token = jwt.sign({userId:userExist._id},process.env.JWT_SECRET,{expiresIn:"2d"})
       return res.status(200).json({ "message": "User has been logged in successfully",token })
   } catch (err) {
      res.status(500).json({"message":"Failed to Login!",error:err.message})
   }
}
