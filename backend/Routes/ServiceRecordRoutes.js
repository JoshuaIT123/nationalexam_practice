import express from 'express'
import { createServiceRecord,getServiceRecord, updateServiceRecord, deleteServiceRecord } from '../controllers/ServiceRecord.controller.js'
import auth from '../middlewares/auth.js'
const router = express.Router();

router.post("/",auth,createServiceRecord)
router.get("/",auth,getServiceRecord)
router.get("/:id",auth,updateServiceRecord)
router.delete("/:id",auth,deleteServiceRecord)

export default router;