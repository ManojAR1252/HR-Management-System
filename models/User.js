const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
      default: "EMPLOYEE",
    },

    phone: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      default: "",
    },

    joiningDate: {
      type: Date,
      default: null,
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;