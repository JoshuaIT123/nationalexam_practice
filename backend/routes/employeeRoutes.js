import express from 'express';
import {createEmployee, getAllEmployees, exportEmployeesExcel} from '../controller/employee.controller.js'

const employeerouter = express.Router();
employeerouter.get('/all', getAllEmployees)
employeerouter.post('/new',createEmployee)
employeerouter.get('/report',exportEmployeesExcel)

export default employeerouter;