const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../database/database");

const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");


// 📌 ADMIN ROUTE
router.get("/admin-login", (req, res) => {
    res.render('admin-login', {data :'none'});
});


module.exports = router;