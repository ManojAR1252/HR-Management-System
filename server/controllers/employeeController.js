const User = require("../models/User");

// ==========================================
// Get All Employees
// ==========================================
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: "EMPLOYEE",
    }).select("-password");

    res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get employees error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get Single Employee
// ==========================================
const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      role: "EMPLOYEE",
    }).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      employee,
    });
  } catch (error) {
    console.error("Get employee error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Update Employee
// ==========================================
const updateEmployee = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      role: "EMPLOYEE",
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const {
      name,
      phone,
      position,
      joiningDate,
    } = req.body;

    employee.name = name ?? employee.name;
    employee.phone = phone ?? employee.phone;
    employee.position = position ?? employee.position;
    employee.joiningDate =
      joiningDate ?? employee.joiningDate;

    const updatedEmployee = await employee.save();

    const employeeResponse = updatedEmployee.toObject();

    delete employeeResponse.password;

    res.status(200).json({
      message: "Employee updated successfully",
      employee: employeeResponse,
    });
  } catch (error) {
    console.error("Update employee error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Update Employee Status
// ==========================================
const updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid employee status",
        allowedStatuses: ["Active", "Inactive"],
      });
    }

    const employee = await User.findOne({
      _id: req.params.id,
      role: "EMPLOYEE",
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.status = status;

    const updatedEmployee = await employee.save();

    const employeeResponse = updatedEmployee.toObject();

    delete employeeResponse.password;

    res.status(200).json({
      message: "Employee status updated successfully",
      employee: employeeResponse,
    });
  } catch (error) {
    console.error(
      "Update employee status error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
};