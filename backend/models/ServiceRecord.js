import mongoose from "mongoose";

const srSchema = mongoose.Schema({
    recordNumber:String,
    serviceDate:{
        type:Date,
        default:new Date()
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service"
    },
    carId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Car"
    }
    
},
{
   timestamps:true
})

export default mongoose.model("ServiceRecord",srSchema)