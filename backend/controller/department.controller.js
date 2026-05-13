import department from '../model/department.js';
import excel from 'exceljs'

export const getAllDepartments = async (req, res) => {
    try {
        const departments = await department.find();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ "message": "Error fetching departments", "error": error });
    }
}

export const createDepartment = async(req,res) => {
    try {
        const{deptCode,departmentName,grossSalary} = req.body;
        const newDepartment = await department.create({
            deptCode:deptCode,
            departmentName:departmentName,
            grossSalary:grossSalary
        })
        res.status(201).json({"message":"Department created successfully", "department":newDepartment})
    } catch (error) {
        res.status(500).json({"message":"Error creating department", "error":error})
    }
}

export const getReport = async (req, res) => {
    try {
        const departments = await department.find();
        res.status(200).json({"message":"Departments fetched successfully", "departments":departments})
    } catch (error) {
        res.status(500).json({"message":"Error fetching departments", "error":error})
    }
}

export const exportDepartmentReport = async (req, res) => {
    try {
        const departments = await department.find();

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Departments');

        worksheet.columns = [
            { header: 'Department Code', key: 'deptCode',       width: 20 },
            { header: 'Department Name', key: 'departmentName', width: 25 },
            { header: 'Gross Salary',    key: 'grossSalary',    width: 15 },
        ];

        departments.forEach(dept => {
            worksheet.addRow({
                deptCode:       dept.deptCode,
                departmentName: dept.departmentName,
                grossSalary:    dept.grossSalary,
            });
        });

        worksheet.getRow(1).font = { bold: true };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=departments.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({"message":"Error exporting department report", "error":error})
    }
}