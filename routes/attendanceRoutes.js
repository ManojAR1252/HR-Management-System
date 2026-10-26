const express = require("express");

const {
  markAttendance,
  getAttendance,
  getEmployeeAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Mark attendance
router.post(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  markAttendance
);

// Get all attendance
router.get(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  getAttendance
);

// Get attendance of one employee
router.get(
  "/employee/:employeeId",
  protect,
  authorize("HR", "ADMIN"),
  getEmployeeAttendance
);

// Update attendance
router.put(
  "/:id",
  protect,
  authorize("HR", "ADMIN"),
  updateAttendance
);

module.exports = router;