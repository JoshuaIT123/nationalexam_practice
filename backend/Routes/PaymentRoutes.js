import express from "express";
import { createPayment,getPayment } from "../controllers/Payment.controller.js";
import auth from "../middlewares/auth.js";
const router = express.Router();


router.post("/",auth,createPayment)
router.get("/:id",auth,getPayment)
router.get("/",auth,getPayment)

export default router;