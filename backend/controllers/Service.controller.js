import Service from "../models/Service.js";

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service" });
  }
};

export const getService = async (req, res) => {
  try {
    const services = await Service.findById(req.params.id);  
    if (!services) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(services);
  }
 catch (error) {
    res.status(500).json({ message: "Failed to get service" });
  }
};