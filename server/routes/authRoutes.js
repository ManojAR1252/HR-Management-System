const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

router.get(
  "/hr-test",
  protect,
  authorize("HR", "ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome HR/Admin",
      user: req.user,
    });
  }
);

router.get(
  "/employee-test",
  protect,
  authorize("EMPLOYEE", "HR", "ADMIN"),
  (req, res) => {
    res.json({
      message: "Employee-level access granted",
      user: req.user,
    });
  }
);

module.exports = router;