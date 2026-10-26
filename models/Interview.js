const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    mode: {
      type: String,
      enum: ["Technical", "HR", "Managerial"],
      required: true,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Completed",
        "Cancelled",
      ],
      default: "Scheduled",
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;