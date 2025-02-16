const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../database/database");
const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");


// 📌 USER ROUTE
// router.get("/show", (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/test.html'));
// });


module.exports = router;