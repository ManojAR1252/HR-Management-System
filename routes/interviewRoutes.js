const express = require("express");

const {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterviewStatus,
  addInterviewFeedback,
} = require("../controllers/interviewController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Schedule Interview
router.post(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  scheduleInterview
);

// Get All Interviews
router.get(
  "/",
  protect,
  authorize("HR", "ADMIN"),
  getInterviews
);

// Update Interview Status
router.patch(
  "/:id/status",
  protect,
  authorize("HR", "ADMIN"),
  updateInterviewStatus
);

// Add Interview Feedback
router.patch(
  "/:id/feedback",
  protect,
  authorize("HR", "ADMIN"),
  addInterviewFeedback
);

// Get Single Interview
router.get(
  "/:id",
  protect,
  authorize("HR", "ADMIN"),
  getInterviewById
);

module.exports = router;