import Car from '../models/Car.js'

export const createCar = async (req, res) => {
    try {
        const { plateNumber, type, model, manufacturingyear, driverPhone, mechanicName } = req.body
        if (!plateNumber || !type || !model || !manufacturingyear || !driverPhone || !mechanicName) {
            return res.status(400).json({ "message": "All fields are required" })
        }
        const car = await Car.create(req.body);
        return res.status(201).json({ car })
    } catch (error) {
        return res.status(500).json({ "message": "Failed to create car" })
    }
}

export const getCar = async (req, res) => {
    try {
        const cars = await Car.find()
        return res.status(200).json(cars)
    } catch (error) {
        return res.status(500).json({ "message": "Cant find cars" })
    }
}

export const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        if (!car) return res.status(404).json({ "message": "Car not found" })
        return res.status(200).json(car)
    } catch (error) {
        return res.status(500).json({ "message": "Cant find car" })
    }
}

export const updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!car) return res.status(404).json({ "message": "Car not found" })
        return res.status(200).json({ "message": "Car updated successfully", car })
    } catch (error) {
        return res.status(500).json({ "message": "Failed to update car" })
    }
}

export const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id)
        if (!car) return res.status(404).json({ "message": "Car not found" })
        return res.status(200).json({ "message": "Car deleted successfully" })
    } catch (error) {
        return res.status(500).json({ "message": "Failed to delete car" })
    }
}
