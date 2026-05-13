import mongoose from 'mongoose';

const departmentSchema = mongoose.Schema({
    deptCode:String,
    departmentName:String,
    grossSalary:Number,
},{
    timestamps:true
})

export default mongoose.model('department',departmentSchema)