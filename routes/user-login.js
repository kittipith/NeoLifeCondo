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
                WHERE u.user_id = ${user.id} and b.isPaid = 0;`, [], (err, bill_data) => {
                db.get(`SELECT COUNT(DISTINCT b.bill_id) AS total 
                        FROM bill b
                        JOIN room r ON b.room_id = r.room_id  
                        JOIN users u ON r.renter_id = u.user_id
                        WHERE u.user_id = ${user.id} and b.isPaid = 0;`, [], (err, countData) => {
                    res.render("userinfo", { data: data, bill_data: bill_data, total: countData.total });
                });
        });
    });
});

router.post("/user/service", (req, res) => {
    const { numroom, service, date, time, note, filebase64 } = req.body;
    
    console.log("📌 รับข้อมูล:", { numroom, service, date, time, note });
    console.log("🖼️ รูปภาพ Base64:", filebase64.substring(0, 100) + "..."); // แสดงเฉพาะ 100 ตัวอักษรแรก

    if (service === "01"){
        db.get("SELECT room_id FROM room WHERE room_number = ?", [numroom], (err, room_id) => {
            // console.log(room_id.room_id);
            db.run("INSERT INTO servicesReq (service_id, room_id, info, date, time, pic) VALUES (?, ?, ?, ?, ?, ?)", 
                [serviceId, room_id.room_id, note, date, time, filebase64], (err) => {
                    if (err) {
                        console.error("Error inserting service request:", err);
                    } else {
                        console.log("Service request inserted successfully");
                    }
                });
            });
    }else if (service === "02"){
        db.get("SELECT room_id FROM room WHERE room_number = ?", [numroom], (err, room_id) => {
            // console.log(room_id.room_id);
            db.run("INSERT INTO repairReq (room_id, info, date, time, pic) VALUES (?, ?, ?, ?, ?)", 
                [room_id.room_id, note, date, time, filebase64], (err) => {
                    if (err) {
                        console.error("Error inserting repair request:", err);
                    } else {
                        console.log("Repair request inserted successfully");
                    }
                });
            });
    }

    res.redirect("/user/room");
    // res.json({ success: true, message: "ส่งข้อมูลสำเร็จ!", data: { numroom, service, date, time, note, filebase64 } });
});



module.exports = router;