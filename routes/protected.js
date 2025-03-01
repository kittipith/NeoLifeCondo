const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const db = require("../database/database");
const router = express.Router();

//ADMIN ROUTE
router.get("/admin-check", verifyToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "You do not have admin privileges" });
  }
  res.json({ message: "Welcome Admin!" });
});

//USER ROUTE
router.get("/user-check", verifyToken, (req, res) => {
  res.json({ message: "Welcome User!" , user: req.user.isAdmin});
});

module.exports = router;