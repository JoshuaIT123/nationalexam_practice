import express from 'express';
import { createCar, getCar } from '../controllers/Car.controller.js';

import auth from '../middlewares/auth.js';

const router = express.Router();

router.post("/", auth, createCar)
router.get("/", auth, getCar)

export default router;