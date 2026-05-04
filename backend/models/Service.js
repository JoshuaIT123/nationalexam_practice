import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
    serviceCode:{
        type:String,
        default:"00000"
    },
    serviceName:String,
    servicePrice:String
},
{
  timestamps:true
})

export default mongoose.model("Service",serviceSchema)