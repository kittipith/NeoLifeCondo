const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");
const db = require("../database/database");

// 📌 แสดงข้อมูล USER
//res.render("test", { condos: rows }); // ส่งข้อมูลไปที่ template

//หน้า Default
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../website/templates/test.html'));
})

//หน้าแสดง condo ทั้งหมด
router.get("/condo", (req, res) => {
    // db.all(`SELECT * FROM condo WHERE renter_id is NULL`, [], (err, data) => {
    //     res.render("test", { condos: data });
    // });
    res.render("test", { name: "boss" });
})

//หน้าที่เลือก condo แล้ว
router.get("/condo/:id", (req, res) => {
    const roomId = req.params.id;
    db.get(`SELECT * FROM room WHERE renter_id is NULL AND ${roomId} = room_id`, [], (err, data) => {
        res.render("room_detail", { condo: data });
        // res.json({condos: data});
    });
})

//หน้าที่เลือก condo แล้วมีข้อมูลให้กรอก
router.get("/condo/:id/reserve", (req, res) => {
    const roomId = req.params.id;
    db.get(`SELECT * FROM room WHERE renter_id is NULL AND ${roomId} = room_id`, [], (err, data) => {
        res.render("booking", { condo: data });
        // res.json({condos: data});
    });
})

//ยืนยันการจองคอนโด
router.post("/condo/:id/reserve", async (req, res) => {
    const data = req.body;
    console.log("ข้อมูลที่ได้รับ:", data);

    const contactDateTime = `${data.contact_day} ${data.contact_time}:00`;
    const address = `${data.address} ${data.street} ${data.district} ${data.subDistrict} ${data.province} ${data.postalCode}`;
    // console.log(contactDateTime);
    db.run(
        `INSERT INTO users 
        (id_number, title, name, surname, nickname, age, gender, nationality, ethnicity, birthday, contact_day) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.idCard,
            data.prefix,
            data.firstName,
            data.lastName,
            data.nickname,
            data.age,
            data.gender,
            data.nationality,
            data.ethnicity,
            data.birthdate,
            contactDateTime,
        ]
    );
    db.get(`SELECT user_id FROM users WHERE id_number = ?`, [data.idCard], (err, info) => {
        console.log(info.user_id);
        db.run(
            `UPDATE users SET address_id = ? WHERE id_number = ?`,
            [info.user_id, data.idCard]
        );
        db.run(
            `INSERT INTO address(address_id, address, phone, line, email) VALUES (?, ?, ?, ?, ?)`,
            [info.user_id, address, data.phone, data.lineId, data.email]
        );
    });
    
    res.send("you good");
})


router.get("/user/information", verifyToken, (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const user = users.find(u => u.id === decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    });
});

module.exports = router;