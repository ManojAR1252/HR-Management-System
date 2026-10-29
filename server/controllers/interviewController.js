const Interview = require("../models/Interview");
const Candidate = require("../models/Candidate");

// ==========================================
// Schedule Interview
// ==========================================
const scheduleInterview = async (req, res) => {
  try {
    const {
      candidate,
      interviewer,
      date,
      interviewType,
      mode,
      meetingLink,
      location,
    } = req.body;

    // Required fields
    if (!candidate || !interviewer || !date || !mode) {
      return res.status(400).json({
        message:
          "Candidate, interviewer, date and mode are required",
      });
    }

    // Check candidate exists
    const existingCandidate = await Candidate.findById(candidate);

    if (!existingCandidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    // Create interview
    const interview = await Interview.create({
      candidate,
      interviewer,
      date,
      interviewType: interviewType || "Online",
      mode,
      meetingLink: meetingLink || "",
      location: location || "",
    });

    // Update candidate status
    existingCandidate.status = "Interview";
    await existingCandidate.save();

    const populatedInterview = await Interview.findById(
      interview._id
    )
      .populate("candidate", "name email position")
      .populate("interviewer", "name email role");

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview: populatedInterview,
    });
  } catch (error) {
    console.error("Schedule interview error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get All Interviews
// ==========================================
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("candidate", "name email position")
      .populate("interviewer", "name email role")
      .sort({ date: 1 });

    res.status(200).json({
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get Single Interview
// ==========================================
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("candidate", "name email position")
      .populate("interviewer", "name email role");

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      interview,
    });
  } catch (error) {
    console.error("Get interview error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateInterviewStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      const allowedStatuses = [
        "Scheduled",
        "Completed",
        "Cancelled",
      ];
  
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid interview status",
          allowedStatuses,
        });
      }
  
      const interview = await Interview.findById(req.params.id);
  
      if (!interview) {
        return res.status(404).json({
          message: "Interview not found",
        });
      }
  
      interview.status = status;
  
      const updatedInterview = await interview.save();
  
      res.status(200).json({
        message: "Interview status updated successfully",
        interview: updatedInterview,
      });
    } catch (error) {
      console.error("Update interview status error:", error);
  
      res.status(500).json({
        message: "Server error",
      });
    }
  };

  const addInterviewFeedback = async (req, res) => {
    try {
      const { feedback } = req.body;
  
      if (!feedback) {
        return res.status(400).json({
          message: "Feedback is required",
        });
      }
  
      const interview = await Interview.findById(req.params.id);
  
      if (!interview) {
        return res.status(404).json({
          message: "Interview not found",
        });
      }
  
      interview.feedback = feedback;
  
      const updatedInterview = await interview.save();
  
      res.status(200).json({
        message: "Interview feedback added successfully",
        interview: updatedInterview,
      });
    } catch (error) {
      console.error("Add interview feedback error:", error);
  
      res.status(500).json({
        message: "Server error",
      });
    }
  };

module.exports = {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterviewStatus,
  addInterviewFeedback,
};