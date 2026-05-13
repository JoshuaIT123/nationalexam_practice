import mongoose from 'mongoose';


const employeeSchema = mongoose.Schema({
    employeeNumber:String,
    firstName:String,
    lastName:String,
    position:String,
    address:String,
    telephone:String,
    hiredDate:Date,
    gender:String,
    deptId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'department'
    }
},{
    timestamps:true
})

export default mongoose.model('employee',employeeSchema);