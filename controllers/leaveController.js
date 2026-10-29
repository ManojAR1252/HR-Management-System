const mongoose = require("mongoose");

const Leave = require("../models/Leave");
const User = require("../models/User");

// ======================================
// Get Logged-in User ID
// ======================================

const getLoggedInUserId = (req) => {
  return (
    req.user?.userId ||
    req.user?.id ||
    req.user?._id
  );
};

// ======================================
// Apply Leave
// ======================================

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

    if (!mongoose.Types.ObjectId.isValid(employee)) {
      return res.status(400).json({
        message: "Invalid employee ID",
      });
    }

    const loggedInUserId = getLoggedInUserId(req);

    // Employee can apply leave only for themselves
    if (
      req.user?.role === "EMPLOYEE" &&
      String(loggedInUserId) !== String(employee)
    ) {
      return res.status(403).json({
        message:
          "Employees can apply leave only for themselves",
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
        message:
          "Start date cannot be after end date",
      });
    }

    const leave = await Leave.create({
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    const populatedLeave =
      await Leave.findById(leave._id)
        .populate(
          "employee",
          "name email employeeId position"
        );

    return res.status(201).json({
      message:
        "Leave application submitted successfully",
      leave: populatedLeave,
    });
  } catch (error) {
    console.error(
      "Apply leave error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================
// Get All Leaves
// HR/Admin only
// ======================================

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

    return res.status(200).json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error(
      "Get leaves error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================
// Get Employee Leaves
// ======================================

const getEmployeeLeaves = async (
  req,
  res
) => {
  try {
    const { employeeId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        employeeId
      )
    ) {
      return res.status(400).json({
        message: "Invalid employee ID",
      });
    }

    const loggedInUserId =
      getLoggedInUserId(req);

    // Employee can see ONLY their own leaves
    if (
      req.user?.role === "EMPLOYEE" &&
      String(loggedInUserId) !==
        String(employeeId)
    ) {
      return res.status(403).json({
        message:
          "Employees can view only their own leaves",
      });
    }

    const leaves = await Leave.find({
      employee: employeeId,
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

    return res.status(200).json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error(
      "Get employee leaves error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================
// Approve / Reject Leave
// HR/Admin only
// ======================================

const updateLeaveStatus = async (
  req,
  res
) => {
  try {
    const { status, reviewComment } =
      req.body;

    if (
      !["Approved", "Rejected"].includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Status must be Approved or Rejected",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: "Invalid leave ID",
      });
    }

    const leave = await Leave.findById(
      req.params.id
    );

    if (!leave) {
      return res.status(404).json({
        message:
          "Leave application not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        message:
          "Only pending leave applications can be reviewed",
      });
    }

    leave.status = status;
    leave.reviewedBy =
      getLoggedInUserId(req);
    leave.reviewComment =
      reviewComment || "";

    const updatedLeave =
      await leave.save();

    const populatedLeave =
      await Leave.findById(
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

    return res.status(200).json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave: populatedLeave,
    });
  } catch (error) {
    console.error(
      "Update leave status error:",
      error
    );

    return res.status(500).json({
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
