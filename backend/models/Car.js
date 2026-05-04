
 import mongoose from "mongoose";

 const carSchema = mongoose.Schema({
    plateNumber:String,
    type:String,
    model:String,
    manufacturingyear:String,
    driverPhone:String,
    mechanicName:String

 },
 {
    timestamps:true
 });

 export default mongoose.model("Car",carSchema);