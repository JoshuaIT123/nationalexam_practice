import employee from '../model/employee.js';
import exceljs from 'exceljs';

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await employee.find().populate('deptId');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ "message": "Error fetching employees", "error": error });
    }
}

export const createEmployee = async(req,res) =>{
    try {
        const {employeeNumber,firstName,lastName,position,address,telephone,hiredDate,gender,deptId} = req.body;
        const newEmployee = await employee.create({
            employeeNumber:employeeNumber,
            firstName:firstName,
            lastName:lastName,
            position:position,
            address:address,
            telephone:telephone,
            hiredDate:hiredDate,
            gender:gender,
            deptId:deptId
        })
        res.status(201).json({"message":"Employee created successfully", "employee":newEmployee})
    } catch (error) {
        res.status(500).json({"message":"Error creating employee", "error":error})
    }
}

export const exportEmployeesExcel = async (req, res) => {
    try {
        const employees = await employee.find();

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Employees');

        worksheet.columns = [
            { header: 'Employee Number', key: 'employeeNumber', width: 20 },
            { header: 'First Name',      key: 'firstName',      width: 15 },
            { header: 'Last Name',       key: 'lastName',       width: 15 },
            { header: 'Position',        key: 'position',       width: 20 },
            { header: 'Address',         key: 'address',        width: 25 },
            { header: 'Telephone',       key: 'telephone',      width: 15 },
            { header: 'Hired Date',      key: 'hiredDate',      width: 15 },
            { header: 'Gender',          key: 'gender',         width: 10 },
        ];

        employees.forEach(emp => {
            worksheet.addRow({
                employeeNumber: emp.employeeNumber,
                firstName:      emp.firstName,
                lastName:       emp.lastName,
                position:       emp.position,
                address:        emp.address,
                telephone:      emp.telephone,
                hiredDate:      emp.hiredDate?.toISOString().split('T')[0],
                gender:         emp.gender,
            });
        });

        worksheet.getRow(1).font = { bold: true };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({"message":"Error exporting Excel", "error":error})
    }
}