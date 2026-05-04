import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import router from './Routes/UserRoutes.js'

import userRoutes from './Routes/UserRoutes.js'
import PaymentRoutes from './Routes/PaymentRoutes.js'
import CarRoutes from './Routes/CarRoutes.js'
import ServiceRoutes from './Routes/ServiceRoutes.js'
import ServiceRecordRoutes from './Routes/ServiceRecordRoutes.js' 

dotenv.config()


const app = express()

//Middlewares
app.use(cors())
app.use(express.json())
app.use('/',router)
app.use('/api/users',userRoutes)
app.use('/api/payments',PaymentRoutes)
app.use('/api/cars',CarRoutes)
app.use('/api/services',ServiceRoutes)
app.use('/api/service-records',ServiceRecordRoutes)


//DB connection
mongoose.connect(process.env.MONGODB_URL)
   .then(() => {
      console.log("DB connected!✅")
   })
   .catch((error) => {
      console.error("DB connection error:", error)
   })



app.listen(process.env.PORT, () => {
   console.log(`Server is running on http://localhost:${process.env.PORT}`)
})