import express from 'express'
import { createService, getAllServices } from '../controllers/Service.controller.js'
import auth from '../middlewares/auth.js'
const router = express.Router();

router.post("/",auth,createService)
router.get("/",auth,getAllServices)

export default router;