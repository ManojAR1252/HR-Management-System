const Leave = require("../models/Leave");
const User = require("../models/User");

// Apply Leave
const applyLeave = async (req, res) => {
  try {
    const {
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    if (
      !employee ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {
      return res.status(400).json({
        message:
          "Employee, leave type, start date, end date and reason are required",
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

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        message: "Start date cannot be after end date",
      });
    }

    const leave = await Leave.create({
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    const populatedLeave = await Leave.findById(
      leave._id
    ).populate(
      "employee",
      "name email employeeId position"
    );

    res.status(201).json({
      message: "Leave application submitted successfully",
      leave: populatedLeave,
    });
  } catch (error) {
    console.error("Apply leave error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Leaves
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate(
        "employee",
        "name email employeeId position"
      )
      .populate(
        "reviewedBy",
        "name email role"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("Get leaves error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Employee Leaves
const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.params.employeeId,
    })
      .populate(
        "employee",
        "name email employeeId position"
      )
      .populate(
        "reviewedBy",
        "name email role"
      )
      .sort({ startDate: -1 });

    res.status(200).json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("Get employee leaves error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Leave Status
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, reviewComment } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave application not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending leave applications can be reviewed",
      });
    }

    leave.status = status;
    leave.reviewedBy = req.user.userId;
    leave.reviewComment = reviewComment || "";

    const updatedLeave = await leave.save();

    const populatedLeave = await Leave.findById(
      updatedLeave._id
    )
      .populate(
        "employee",
        "name email employeeId position"
      )
      .populate(
        "reviewedBy",
        "name email role"
      );

    res.status(200).json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave: populatedLeave,
    });
  } catch (error) {
    console.error("Update leave status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  applyLeave,
  getLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
};