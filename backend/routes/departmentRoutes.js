import express from 'express'
import {createDepartment, getAllDepartments, exportDepartmentReport} from '../controller/department.controller.js'

const departmentrouter = express.Router()

departmentrouter.get('/all', getAllDepartments)
departmentrouter.post('/new',createDepartment)
departmentrouter.get('/report',exportDepartmentReport)

export default departmentrouter;