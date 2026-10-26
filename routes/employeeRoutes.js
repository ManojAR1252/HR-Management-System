const express = require("express");

const {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
} = require("../controllers/employeeController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all employees
router.get(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  getEmployees
);

// Get single employee
router.get(
  "/:id",
  protect,
  authorize("HR", "ADMIN"),
  getEmployeeById
);

// Update employee
router.put(
  "/:id",
  protect,
  authorize("HR", "ADMIN"),
  updateEmployee
);

// Update employee status
router.patch(
  "/:id/status",
  protect,
  authorize("HR", "ADMIN"),
  updateEmployeeStatus
);

module.exports = router;