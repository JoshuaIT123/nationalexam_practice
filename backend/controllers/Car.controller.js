import Car from '../models/Car.js'

export const creatCar = async (req,res) =>{
    try {
        const car = await Car.create(req.body);
        res.status(201).json(car)
        
    } catch (error) {
        res.status(500).json({"message":"Failed to create car"})
        
    }

}

export const getCar = async(req,res) =>{
    try {
        const cars = await Car.find()
        res.status(201).json(cars)
    } catch (error) {
        res.status(500).json({"message":"Cant find the car"})
        
    
        }
    }
