import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import departmentrouter from './routes/departmentRoutes.js';
import salaryrouter from './routes/salaryRoutes.js';
import employeerouter from './routes/employeeRoutes.js';
import userRouter from './routes/userRoutes.js'





dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json());
app.use('/api/employee',employeerouter)
app.use('/api/salary',salaryrouter)
app.use('/api/department',departmentrouter)
app.use('/api',userRouter)

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
    .catch((error)=>{
     console.error('Could not connect to MongoDB', err)

    });

 const port = process.env.PORT 
 
 app.listen(port,()=>{
      console.log(`Server is running on port ${process.env.PORT}`)
 })