const express = require("express");

const {
  applyLeave,
  getLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================
// Apply Leave
// EMPLOYEE, HR, ADMIN
// ======================================

router.post(
  "/",
  protect,
  authorize("EMPLOYEE", "HR", "ADMIN"),
  applyLeave
);

// ======================================
// Get All Leaves
// HR/Admin only
// ======================================

router.get(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  getLeaves
);

// ======================================
// Get Employee Leave History
// EMPLOYEE, HR, ADMIN
// ======================================

router.get(
  "/employee/:employeeId",
  protect,
  authorize("EMPLOYEE", "HR", "ADMIN"),
  getEmployeeLeaves
);

// ======================================
// Approve / Reject Leave
// HR/Admin only
// ======================================

router.patch(
  "/:id/status",
  protect,
  authorize("HR", "ADMIN"),
  updateLeaveStatus
);

module.exports = router;
