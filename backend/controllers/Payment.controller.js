import Payment from "../models/Payment.js";

export const createPayment = async (req,res) =>{
    try {
        const {amountPaid, recordId} = req.body
        if(!amountPaid || !recordId){
            return res.status(400).json({"message":"amountPaid and recordId are required"})
        }
        const payment = await Payment.create(req.body);
        return res.status(201).json(payment)
    } catch (error) {
        res.status(500).json({"message":"Failed to create payment"})
    }
}

export const getPayment = async (req,res) =>{
    try {
        const payments = await Payment.find().populate({path:"recordId",
            populate:[{path:"carId"},{path:"serviceId"}]
        })
        return res.status(200).json(payments)
         }
    catch (error) {
        res.status(500).json({"message":"Failed to get payment","err":error.message})
    }
}


