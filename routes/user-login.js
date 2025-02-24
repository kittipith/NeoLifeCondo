const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../database/database");
const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");


// 📌 USER ROUTE
router.get("/user/room", (req, res) => {
    const token = req.cookies.refreshToken;

    //ตรวจสอบและถอดรหัส refresh token
    // const decoded = jwt.verify(token, REFRESH_SECRET);
    // console.log("Decoded Token:", decoded);

    res.render('newboard', {data :'none'});
});

router.get("/user/information", (req, res) => {
    const token = req.cookies.refreshToken;

    //ตรวจสอบและถอดรหัส refresh token
    const user = jwt.verify(token, REFRESH_SECRET);
    console.log("Decoded Token:", user.id);
    db.get(`SELECT * FROM users WHERE account_id = ${parseInt(user.id)}`, [], (err, data) => {
        // res.render("booking", { condo: data });
        res.json({condos: data});
    });
})


module.exports = router;