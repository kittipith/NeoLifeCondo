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

    db.all("SELECT * FROM news WHERE status = 1", (err, data) => {
        console.log(data);
        res.render('newboard', { data: data });
    });
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
    const { numroom, service, date, time, note, filebase641 } = req.body;

    // console.log("📌 รับข้อมูล:", { numroom, service, date, time, note });
    // console.log("🖼️ รูปภาพ Base64:", filebase64.substring(0, 100) + "..."); // แสดงเฉพาะ 100 ตัวอักษรแรก

    if (service === "01") {
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
    } else if (service === "02") {
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

router.post("/user/contactstaff", (req, res) => {
    const { numroom, cont, date, time, title, info, filebase642 } = req.body;

    // console.log("📌 รับข้อมูล:", { numroom, cont, date, time, title, info });
    // console.log("🖼️ รูปภาพ Base64:", filebase642.substring(0, 100) + "..."); // แสดงเฉพาะ 100 ตัวอักษรแรก

    if (cont === "01") {
        // console.log(room_id.room_id);
        db.run("INSERT INTO news (new_name, info, date, time, pic) VALUES (?, ?, ?, ?, ?)",
            [title, info, date, time, filebase642], (err) => {
                if (err) {
                    console.error("Error inserting new request:", err);
                } else {
                    console.log("New request inserted successfully");
                }
            });
    } else if (cont === "02") {
        db.get("SELECT room_id FROM room WHERE room_number = ?", [numroom], (err, room_id) => {
            // console.log(room_id.room_id);
            db.run("INSERT INTO contact_staff (room_id, contact_name, info, date, time, pic) VALUES (?, ?, ?, ?, ?, ?)",
                [room_id.room_id, tile, info, date, time, filebase642], (err) => {
                    if (err) {
                        console.error("Error inserting contactStaff request:", err);
                    } else {
                        console.log("ContactStaff request inserted successfully");
                    }
                });
        });
    }

    res.redirect("/user/room");
});

router.post("/user/savecowork", (req, res) => {
    const { cowork_name, room_id, day, starttime, endtime, info } = req.body;
    const day_starttime = `${day} ${starttime}:00`;
    const day_endtime = `${day} ${endtime}:00`;
    db.run("INSERT INTO Cowork (cowork_name, room_id, starttime, endtime, info) VALUES (?, ?, ?, ?, ?)",
            [cowork_name, room_id, day_starttime, day_endtime, info], (err) => {
                if (err) {
                    console.error("Error inserting new request:", err);
                } else {
                    console.log("New request inserted successfully");
                }
            });
    
    res.redirect("/user/room");
});

router.get("/user/meeting", (req, res) => {
    const token = req.cookies.refreshToken;

    //ตรวจสอบและถอดรหัส refresh token
    const user = jwt.verify(token, REFRESH_SECRET);
    db.get(`SELECT * FROM Cowork c
            JOIN room r ON c.room_id = r.room_id  
            JOIN users u ON r.renter_id = u.user_id
            WHERE u.user_id = ${user.id};`, [], (err, data) => {
                res.render("meetingroom", { data: data });
            });
})

router.get('/meetdata', (req, res) => {
    const query = 'SELECT * FROM CoWork;';
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.send(JSON.stringify(rows));        
    });
});

router.get("/user/bill/:billId", (req, res) => {
    const billId = req.params.billId; // ดึง billId จาก URL

    let sql = `SELECT * FROM bill b
    JOIN room r ON b.room_id = r.room_id  
    JOIN users u ON r.renter_id = u.user_id
    WHERE b.bill_id = ${billId}`;

    db.get(sql, [], (err, data) => {
        res.render("bill", { data: data});
        // res.json({condos: data});
    });
})



module.exports = router;