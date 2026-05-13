import ServiceRecord from '../models/ServiceRecord.js'

export const createServiceRecord = async (req,res) =>{
    try {
        const {recordNumber, carId, serviceId} = req.body
        if(!recordNumber || !carId || !serviceId){
            return res.status(400).json({"message":"recordNumber, carId and serviceId are required"})
        }
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
    catch(error){
       res.status(500).json({"message":"Failed to get service record"})
    }
}

export const updateServiceRecord = async (req,res) =>{
    try {
        const serviceRecord = await ServiceRecord.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!serviceRecord) return res.status(404).json({"message":"Service record not found"})
        res.status(200).json({"message":"Service record updated successfully", serviceRecord})
    } catch (error) {
        res.status(500).json({"message":"Failed to update service record"})
    }
}

export const deleteServiceRecord = async (req,res) =>{
    try {
        const serviceRecord = await ServiceRecord.findByIdAndDelete(req.params.id)
        if(!serviceRecord) return res.status(404).json({"message":"Service record not found"})
        res.status(200).json({"message":"Service record deleted successfully"})
    } catch (error) {
        res.status(500).json({"message":"Failed to delete service record"})
    }
}



    
