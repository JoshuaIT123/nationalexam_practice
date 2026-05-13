import salary from '../model/salary.js';
import excel from 'exceljs';

export const createSalary = async(req,res) =>{
    try {
        const {grossSalary,totalDeduction,netSalary,month,deptCode} = req.body;
        const newSalary = await salary.create({
            grossSalary:grossSalary,
            totalDeduction:totalDeduction,
            netSalary:netSalary,
            month:month,
            deptCode:deptCode
        })
        res.status(201).json({"message":"Salary created successfully", "salary":newSalary})
    } catch (error) {
        res.status(500).json({"message":"Error creating salary", "error":error})
    }
}

export const getAllSalaries = async(req,res) =>{
    try {
        const salaries = await salary.find().populate('deptCode');
        res.status(200).json({"message":"Salaries retrieved successfully", "salaries":salaries})
    } catch (error) {
        res.status(500 ).json({"message":"Error retrieving salaries", "error":error})   
    }
}

export const updateSalary = async(req,res) =>{
    try {
        const id = req.params.id
        const updatesalary = await salary.findByIdAndUpdate(id,req.body)
        res.status(200).json({"message":"Salary updated successfully", "salary":updatesalary})
    } catch (error) {
        res.status(500).json({"message":"Error updating salary", "error":error})
        
    }
}


export const deleteSalary = async(req,res) =>{
    try {
        const id = req.params.id    
        const deletesalary = await salary.findByIdAndDelete(id)
        res.status(200).json({"message":"Salary deleted successfully", "salary":deletesalary})
 }
    catch (error) {
        res.status(500).json({"message":"Error deleting salary", "error":error})
    }
}

export const exportSalaryReport = async (req, res) => {
    try {
        // 1. Fetch data from MongoDB
        const salaries = await salary.find().populate('deptCode');

        // 2. Initialize Excel Workbook & Worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Salary Report');

        // 3. Define Columns (Headers)
        worksheet.columns = [
            { header: 'Month', key: 'month', width: 15 },
            { header: 'Gross Salary', key: 'grossSalary', width: 15 },
            { header: 'Total Deduction', key: 'totalDeduction', width: 15 },
            { header: 'Net Salary', key: 'netSalary', width: 15 },
            { header: 'Department', key: 'deptName', width: 20 }
        ];

        // 4. Add Rows from Mongoose Data
        salaries.forEach((item) => {
            worksheet.addRow({
                month: item.month,
                grossSalary: item.grossSalary,
                totalDeduction: item.totalDeduction,
                netSalary: item.netSalary,
                deptName: item.deptCode ? item.deptCode.name : 'N/A' // Handle populated field
            });
        });

        // 5. Style the Header Row (Bold & Background Color)
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' }
            };
        });

        // 6. Set Response Headers for File Download
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'Salary_Report.xlsx'
        );

        // 7. Write to Response Stream
        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        res.status(500).json({ message: "Error generating report", error: error.message });
    }
};