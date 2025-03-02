const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");
const db = require("../database/database");
const { render } = require("ejs");
const { console } = require("inspector/promises");

// 📌 แสดงข้อมูล USER
//res.render("test", { condos: rows }); // ส่งข้อมูลไปที่ template

//หน้า Default
router.get("/", (req, res) => {
    res.redirect("/condo");
});

//หน้าแสดง condo ทั้งหมด
router.get("/condo", (req, res) => {
    res.render("home");
});

router.get("/api/condo", (req, res) => {
    db.all(`SELECT * FROM room WHERE renter_id is NULL`, [], (err, data) => {
        res.json({ rooms: data });
    });
});

//หน้าที่เลือก condo แล้ว
router.get("/condo/:id", (req, res) => {
    const roomId = req.params.id;
    db.get(`SELECT * FROM room WHERE renter_id is NULL AND ${roomId} = room_id`, [], (err, data) => {
        if (err) {
            res.redirect("/condo");
        }
        res.render("room_detail", { condo: data });
        // res.json({condos: data});
    });
});

//หน้าที่เลือก condo แล้วมีข้อมูลให้กรอก
router.get("/condo/:id/reserve", (req, res) => {
    const roomId = req.params.id;
    db.get(`SELECT * FROM room WHERE renter_id is NULL AND ${roomId} = room_id`, [], (err, data) => {
        res.render("booking", { condo: data });
        // res.json({condos: data});
    });
});

//ยืนยันการจองคอนโด
router.post("/condo/:id/reserve", async (req, res) => {
    const data = req.body;
    console.log("ข้อมูลที่ได้รับ:", data);

    const contactDateTime = `${data.contact_day} ${data.contact_time}:00`;
    const address = `${data.address}$${data.street}$${data.district}$${data.subDistrict}$${data.province}$${data.postalCode}`;
    const idCard = data.idCard.slice(0, 1) + '-' +data.idCard.slice(1, 5) + '-' +data.idCard.slice(5, 10) + '-' + data.idCard.slice(10, 12) + '-' +data.idCard.slice(12);
    // console.log(contactDateTime);
    db.run(
        `INSERT INTO users 
        (id_number, title, name, surname, nickname, age, gender, nationality, religion, ethnicity, birthday, contact_day) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            idCard,
            data.prefix,
            data.firstName,
            data.lastName,
            data.nickname,
            data.age,
            data.gender,
            data.nationality,
            data.religion,
            data.ethnicity,
            data.birthdate,
            contactDateTime,
        ]
    );
    db.get(`SELECT user_id FROM users WHERE id_number = ?`, [idCard], (err, info) => {
        console.log(info.user_id);
        db.run(
            `UPDATE users SET address_id = ? WHERE id_number = ?`,
            [info.user_id, idCard]
        );
        db.run(
            `INSERT INTO address(address_id, address, phone, line, email) VALUES (?, ?, ?, ?, ?)`,
            [info.user_id, address, data.phone, data.lineId, data.email]
        );
    });
    
    res.redirect("/");
});


module.exports = router;