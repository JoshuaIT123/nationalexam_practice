import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
          paymentNumber: String,
          amountPaid:Number,
          recordId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ServiceRecord"
          },
          paymentDate:{
            type:Date,
            default: new Date()
          }
          
          
},{
    timestamps:true
})

export default mongoose.model("Payment",paymentSchema)