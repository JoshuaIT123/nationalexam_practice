import mongoose from 'mongoose';

const salarySchema = mongoose.Schema({
    grossSalary:Number,
    totalDeduction:Number,
    netSalary:Number,
    month:String,
    deptCode:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'department'
    }
    
})

export default mongoose.model('salary',salarySchema)