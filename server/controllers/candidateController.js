const Candidate = require("../models/Candidate");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================================
// Add Single Candidate
// ==========================================
const addCandidate = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      experience,
      skills,
      resume,
    } = req.body;

    if (!name || !email || !phone || !position) {
      return res.status(400).json({
        message: "Name, email, phone and position are required",
      });
    }

    const existingCandidate = await Candidate.findOne({ email });

    if (existingCandidate) {
      return res.status(409).json({
        message: "Candidate already exists",
      });
    }

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      position,
      experience: experience || 0,
      skills: skills || [],
      resume: resume || "",
    });

    res.status(201).json({
      message: "Candidate added successfully",
      candidate,
    });
  } catch (error) {
    console.error("Add candidate error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Add Multiple Candidates
// ==========================================
const addMultipleCandidates = async (req, res) => {
  try {
    const candidates = req.body;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of candidates",
      });
    }

    const createdCandidates = await Candidate.insertMany(candidates);

    res.status(201).json({
      message: "Candidates added successfully",
      count: createdCandidates.length,
      candidates: createdCandidates,
    });
  } catch (error) {
    console.error("Add multiple candidates error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get All Candidates
// ==========================================
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error("Get candidates error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Get Single Candidate
// ==========================================
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      candidate,
    });
  } catch (error) {
    console.error("Get candidate error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Update Candidate
// ==========================================
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    const {
      name,
      email,
      phone,
      position,
      experience,
      skills,
      resume,
    } = req.body;

    candidate.name = name ?? candidate.name;
    candidate.email = email ?? candidate.email;
    candidate.phone = phone ?? candidate.phone;
    candidate.position = position ?? candidate.position;
    candidate.experience = experience ?? candidate.experience;
    candidate.skills = skills ?? candidate.skills;
    candidate.resume = resume ?? candidate.resume;

    const updatedCandidate = await candidate.save();

    res.status(200).json({
      message: "Candidate updated successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Update candidate error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Update Candidate Status
// ==========================================
const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid candidate status",
        allowedStatuses,
      });
    }

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    candidate.status = status;

    const updatedCandidate = await candidate.save();

    res.status(200).json({
      message: "Candidate status updated successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Update candidate status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Convert Candidate to Employee
// ==========================================
const convertCandidateToEmployee = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    if (candidate.status !== "Selected") {
      return res.status(400).json({
        message:
          "Only selected candidates can be converted to employees",
      });
    }

    const existingUser = await User.findOne({
      email: candidate.email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Employee account already exists",
      });
    }

    const employeeCount = await User.countDocuments({
      role: "EMPLOYEE",
    });

    const employeeId = `EMP${String(employeeCount + 1).padStart(
      3,
      "0"
    )}`;

    const defaultPassword = "Employee@123";

    const hashedPassword = await bcrypt.hash(
      defaultPassword,
      10
    );

    const employee = await User.create({
      name: candidate.name,
      email: candidate.email,
      password: hashedPassword,
      role: "EMPLOYEE",
      phone: candidate.phone,
      position: candidate.position,
      joiningDate: new Date(),
      employeeId,
      status: "Active",
    });

    res.status(201).json({
      message: "Candidate converted to employee successfully",
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        position: employee.position,
        joiningDate: employee.joiningDate,
        status: employee.status,
      },
      loginCredentials: {
        email: employee.email,
        temporaryPassword: defaultPassword,
      },
    });
  } catch (error) {
    console.error(
      "Convert candidate to employee error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// Export All Controllers
// ==========================================
module.exports = {
  addCandidate,
  addMultipleCandidates,
  getCandidates,
  getCandidateById,
  updateCandidate,
  updateCandidateStatus,
  convertCandidateToEmployee,
};