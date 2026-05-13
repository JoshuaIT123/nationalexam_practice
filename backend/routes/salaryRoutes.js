import {createSalary,getAllSalaries,updateSalary,deleteSalary,exportSalaryReport} from '../controller/salary.controller.js'
import express from 'express';

const salaryrouter = express.Router();

salaryrouter.post('/new', createSalary);
salaryrouter.get('/view', getAllSalaries);
salaryrouter.put('/update/:id', updateSalary);
salaryrouter.delete('/delete/:id', deleteSalary);
salaryrouter.get('/report', exportSalaryReport);


export default salaryrouter;
