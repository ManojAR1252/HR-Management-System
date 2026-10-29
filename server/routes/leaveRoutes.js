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

// Apply leave
router.post(
  "/",
  protect,
  authorize("EMPLOYEE","HR", "ADMIN"),
  applyLeave
);

// Get all leaves
router.get(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  getLeaves
);

// Get employee leave history
router.get(
  "/employee/:employeeId",
  protect,
  authorize("EMPLOYEE","HR", "ADMIN"),
  getEmployeeLeaves
);

// Approve / Reject leave
router.patch(
  "/:id/status",
  protect,
  authorize("HR", "ADMIN"),
  updateLeaveStatus
);

module.exports = router;
