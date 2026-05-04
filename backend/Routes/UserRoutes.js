import express from "express"
import {registerUser,loginUser} from "../controllers/User.controller.js"
const router = express.Router();


router.post("/api/register",registerUser)
router.post("/api/login",loginUser)

export default router;