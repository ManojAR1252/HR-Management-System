const Candidate = require("../models/Candidate");
const User = require("../models/User");
const Interview = require("../models/Interview");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

const getDashboard = async (req, res) => {
  try {
    // Candidates
    const totalCandidates = await Candidate.countDocuments();

    const selectedCandidates =
      await Candidate.countDocuments({
        status: "Selected",
      });

    const rejectedCandidates =
      await Candidate.countDocuments({
        status: "Rejected",
      });

    const shortlistedCandidates =
      await Candidate.countDocuments({
        status: "Shortlisted",
      });

    // Employees
    const totalEmployees = await User.countDocuments({
      role: "EMPLOYEE",
    });

    const activeEmployees = await User.countDocuments({
      role: "EMPLOYEE",
      status: "Active",
    });

    const inactiveEmployees = await User.countDocuments({
      role: "EMPLOYEE",
      status: "Inactive",
    });

    // Interviews
    const totalInterviews =
      await Interview.countDocuments();

    const scheduledInterviews =
      await Interview.countDocuments({
        status: "Scheduled",
      });

    const completedInterviews =
      await Interview.countDocuments({
        status: "Completed",
      });

    const cancelledInterviews =
      await Interview.countDocuments({
        status: "Cancelled",
      });

    // Today's attendance
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const presentToday =
      await Attendance.countDocuments({
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
        status: "Present",
      });

    const absentToday =
      await Attendance.countDocuments({
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
        status: "Absent",
      });

    const leaveToday =
      await Attendance.countDocuments({
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
        status: "Leave",
      });

    const halfDayToday =
      await Attendance.countDocuments({
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
        status: "Half Day",
      });

    // Leaves
    const totalLeaves =
      await Leave.countDocuments();

    const pendingLeaves =
      await Leave.countDocuments({
        status: "Pending",
      });

    const approvedLeaves =
      await Leave.countDocuments({
        status: "Approved",
      });

    const rejectedLeaves =
      await Leave.countDocuments({
        status: "Rejected",
      });

    res.status(200).json({
      candidates: {
        total: totalCandidates,
        selected: selectedCandidates,
        shortlisted: shortlistedCandidates,
        rejected: rejectedCandidates,
      },

      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
      },

      interviews: {
        total: totalInterviews,
        scheduled: scheduledInterviews,
        completed: completedInterviews,
        cancelled: cancelledInterviews,
      },

      attendanceToday: {
        present: presentToday,
        absent: absentToday,
        leave: leaveToday,
        halfDay: halfDayToday,
      },

      leaves: {
        total: totalLeaves,
        pending: pendingLeaves,
        approved: approvedLeaves,
        rejected: rejectedLeaves,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboard,
};