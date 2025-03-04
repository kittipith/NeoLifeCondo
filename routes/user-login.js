const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../database/database");
const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");
const { route } = require("./auth");


//USER ROUTE
router.get("/user/room", (req, res) => {
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
                            db.all(`SELECT * FROM Cowork c
                                    JOIN room r ON c.room_id = r.room_id  
                                    JOIN users u ON r.renter_id = u.user_id
                                    WHERE u.user_id = ${user.id};`, [], (err, coworkData) => {
                                    res.render("userinfo", { data: data, bill_data: bill_data, total: countData.total, coworkData: coworkData});
                });
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

    if (cont === "01" || cont === "03") {
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
    
    res.redirect(`/user/reserve/${cowork_name}`);
});

router.post("/user/editcowork", (req, res) => {
    const { cowork_id, cowork_name, room_id, day, starttime, endtime, info } = req.body;
    const day_starttime = `${day} ${starttime}:00`;
    const day_endtime = `${day} ${endtime}:00`;
    db.run("UPDATE Cowork SET room_number = ?, starttime = ?, endtime = ?, info = ? WHERE id = ?;",
            [room_id, day_starttime, day_endtime, info, cowork_id], (err) => {
                if (err) {
                    console.error("Error updating new request:", err);
                } else {
                    console.log("New request updated successfully");
                }
            });
    
    res.redirect(`/user/reserve/${cowork_name}`);
});

router.get("/user/reserve/:coworkname", (req, res) => {
    const token = req.cookies.refreshToken;
    const coworkname = req.params.coworkname;
    
    //ตรวจสอบและถอดรหัส refresh token
    const user = jwt.verify(token, REFRESH_SECRET);
    console.log(coworkname);
    
    db.get(`SELECT * FROM Cowork c
            JOIN room r ON c.room_id = r.room_id  
            JOIN users u ON r.renter_id = u.user_id
            WHERE u.user_id = ${user.id} and c.cowork_name = '${coworkname}';`, [], (err, data) => {
                res.render("meetingroom", { data: data , coworkname: coworkname});
            });
})

router.get('/meetdata/:coworkname', (req, res) => {
    const coworkname = req.params.coworkname;
    const query = `SELECT * FROM CoWork WHERE cowork_name = '${coworkname}' ORDER BY starttime ASC;`;
    console.log(query);
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.send(JSON.stringify(rows));        
    });
});

router.get("/user/bill/:billId", (req, res) => {
    const billId = req.params.billId; 

    let sql = `SELECT * FROM bill b
    JOIN room r ON b.room_id = r.room_id  
    JOIN users u ON r.renter_id = u.user_id
    WHERE b.bill_id = ${billId};`;

    let sql2 = `SELECT pic FROM payment
    WHERE bill_id = ${billId};`;

    db.get(sql, [], (err, data) => {
        db.get(sql2, [], (err, pic) => {
            res.render("bill", { data: data, pic: pic});
        });
    });
})

router.post("/user/payment/:billId", (req, res) => {
    const { billId } = req.params;
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: "ต้องการรูปภาพ Base64" });
    }

    db.run("UPDATE payment SET pic = ?, date = CURRENT_DATE, time = CURRENT_TIME WHERE bill_id = ?", [image ,billId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect(`/user/bill/${billId}`);
    });
});

router.get("/user/payment/image/:bill_id", (req, res) => {
    const { bill_id } = req.params;

    db.get("SELECT pic FROM payment WHERE bill_id = ?", [bill_id], (err, data) => {
        if (err || !data || !data.pic) {
            return res.status(404).send("Not Found"); // ถ้าไม่มีรูป ส่ง 404
        }

        const imgBuffer = Buffer.from(data.pic, "base64"); // แปลง Base64 เป็น Buffer
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(imgBuffer);
    });
});



module.exports = router;