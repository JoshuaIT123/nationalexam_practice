import Payment from "../models/Payment.js";

export const createPayment = async (req,res) =>{
    try {
        const payment = await Payment.create(req.body);
        return res.status(201).json(payment)
    } catch (error) {
        res.status(500).json({"message":"Failed to create payment","err":error.message})
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
