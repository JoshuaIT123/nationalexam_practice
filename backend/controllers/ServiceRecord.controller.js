import ServiceRecord from '../models/ServiceRecord.js'

export const createServiceRecord = async (req,res) =>{
    try {
        const serviceRecord = await ServiceRecord.create(req.body);
        res.status(201).json(serviceRecord) 
    } catch (error) {
        res.status(500).json({"message":"Failed to create service record"})
    }
}

export const getServiceRecord = async (req,res) =>{
    try {
        const serviceRecords = await ServiceRecord.find().populate("carId").populate("serviceId")
        res.status(200).json(serviceRecords)    
    }
    catch{
       res.status(500).json({"message":"Failed to get service record"})
    }
}

export const updateServiceRecord = async (req,res) =>{
    await ServiceRecord.findByIdAndUpdate(req.paramas.id,req.body,{new:true})
    res.status(200).json({"message":"Service record updated successfully"})

}

export const deleteServiceRecord = async (req,res) =>{
    await ServiceRecord.findByIdAndDelete(req.paramas.id)
    res.status(200).json({"message":"Service record deleted successfully"})
}