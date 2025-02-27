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
    // console.log("Decoded Token:", user.id);
    db.get(`SELECT * FROM users JOIN address ON users.address_id = address.address_id WHERE account_id = ${user.id}`, [], (err, data) => {
        db.all(`SELECT * FROM bill b
                JOIN room r ON b.room_id = r.room_id  
                JOIN users u ON r.renter_id = u.user_id
                WHERE u.user_id = ${user.id}`, [], (err, bill_data) => {
                db.get(`SELECT COUNT(*) AS total 
                        FROM bill b
                        JOIN room r ON b.room_id = r.room_id  
                        JOIN users u ON r.renter_id = u.user_id
                        WHERE u.user_id = ${user.id};`, [], (err, countData) => {
                    res.render("userinfo", { data: data, bill_data: bill_data, total: countData.total });
                    console.log(bill_data);
                });
        });
    });
})


module.exports = router;