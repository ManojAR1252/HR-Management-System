const express = require("express");

const {
  addCandidate,
  addMultipleCandidates,
  getCandidates,
  getCandidateById,
  updateCandidate,
  updateCandidateStatus,
  convertCandidateToEmployee,
} = require("../controllers/candidateController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// Add Single Candidate
// POST /api/candidates
// ==========================================
router.post(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  addCandidate
);

// ==========================================
// Add Multiple Candidates
// POST /api/candidates/bulk
// ==========================================
router.post(
  "/bulk",
  protect,
  authorize("HR", "ADMIN"),
  addMultipleCandidates
);

// ==========================================
// Get All Candidates
// GET /api/candidates
// ==========================================
router.get(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  getCandidates
);

// ==========================================
// Update Candidate Status
// PATCH /api/candidates/:id/status
// ==========================================
router.patch(
  "/:id/status",
  protect,
  authorize("HR", "ADMIN"),
  updateCandidateStatus
);

// ==========================================
// Convert Candidate to Employee
// POST /api/candidates/:id/convert
// ==========================================
router.post(
  "/:id/convert",
  protect,
  authorize("HR", "ADMIN"),
  convertCandidateToEmployee
);

// ==========================================
// Get Single Candidate
// GET /api/candidates/:id
// ==========================================
router.get(
  "/:id",
  protect,
  authorize("HR", "ADMIN"),
  getCandidateById
);

// ==========================================
// Update Candidate
// PUT /api/candidates/:id
// ==========================================
router.put(
  "/:id",
  protect,
  authorize("HR", "ADMIN"),
  updateCandidate
);

module.exports = router;