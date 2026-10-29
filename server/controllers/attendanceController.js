const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const {
      employee,
      date,
      status,
      checkIn,
      checkOut,
      remarks,
    } = req.body;

    if (!employee || !date || !status) {
      return res.status(400).json({
        message: "Employee, date and status are required",
      });
    }

    const existingEmployee = await User.findOne({
      _id: employee,
      role: "EMPLOYEE",
    });

    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const existingAttendance = await Attendance.findOne({
      employee,
      date,
    });

    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance already marked for this date",
      });
    }

    const attendance = await Attendance.create({
      employee,
      date,
      status,
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      remarks: remarks || "",
    });

    const populatedAttendance =
      await Attendance.findById(attendance._id).populate(
        "employee",
        "name email employeeId position"
      );

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Attendance
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate(
        "employee",
        "name email employeeId position"
      )
      .sort({ date: -1 });

    res.status(200).json({
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Attendance By Employee
const getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employee: req.params.employeeId,
    })
      .populate(
        "employee",
        "name email employeeId position"
      )
      .sort({ date: -1 });

    res.status(200).json({
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error(
      "Get employee attendance error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Attendance
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(
      req.params.id
    );

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    const {
      status,
      checkIn,
      checkOut,
      remarks,
    } = req.body;

    attendance.status = status ?? attendance.status;
    attendance.checkIn =
      checkIn ?? attendance.checkIn;
    attendance.checkOut =
      checkOut ?? attendance.checkOut;
    attendance.remarks =
      remarks ?? attendance.remarks;

    const updatedAttendance =
      await attendance.save();

    const populatedAttendance =
      await Attendance.findById(
        updatedAttendance._id
      ).populate(
        "employee",
        "name email employeeId position"
      );

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error(
      "Update attendance error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getEmployeeAttendance,
  updateAttendance,
};