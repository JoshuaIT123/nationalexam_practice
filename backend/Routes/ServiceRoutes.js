import express from 'express'
import { createService,getService } from '../controllers/Service.controller.js'
import auth from '../middlewares/auth.js'
const router = express.Router();

router.post("/",auth,createService)
router.get("/:id",auth,getService)

export default router;