import express from 'express';
import { creatCar,getCar } from '../controllers/Car.controller.js';

import auth from '../middlewares/auth.js';

const router = express.Router();

router.post("/",auth,creatCar)
router.get("/:id",auth,getCar)
 

export default router;