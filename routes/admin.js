const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../database/database");

const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");



//ADMIN ROUTE
// router.get("/admin-login", (req, res) => {
//     res.render('admin-login', {data :'none'});
// });

router.get("/admin", (req, res) => {
    res.render('admin');
});

router.get("/admin/user-info", (req, res) => {

    const query = `SELECT users.user_id, room.room_number, users.title, users.name, users.surname, address.phone, address.line
FROM room JOIN users ON room.renter_id = users.user_id JOIN address ON users.address_id = address.address_id WHERE users.account_id IS NOT NULL;`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('user-info', { data: rows });
    });
});

router.get("/getcid", (req, res) => {
    let query = `SELECT id_number FROM users WHERE isAdmin IS NULL AND account_id IS NULL`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.json(rows);
    });
});

router.post("/submitdeluser", (req, res) => {
    const data = req.body.selectedid;

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            let sql = `UPDATE room SET renter_id = NULL where renter_id = ${data[i]};`;
            let sqluser = `DELETE FROM users WHERE user_id = ${data[i]};`;
            let sqlacc = `DELETE FROM account WHERE id = ${data[i]};`;
            let sqladd = `DELETE FROM address WHERE address_id = ${data[i]};`;
            db.run(sql, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdone`);
                console.log(sql);
            });
            db.run(sqluser, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdonedeluser`);
                console.log(sql);
            });
            db.run(sqlacc, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdonedeluser`);
                console.log(sql);
            });
            db.run(sqladd, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdonedeluser`);
                console.log(sql);
            });
        }


    } else if (data) {
        let sql = `UPDATE room SET renter_id = NULL where renter_id = ${data};`;
        let sqluser = `DELETE FROM users WHERE user_id = ${data};`;
        let sqlacc = `DELETE FROM account WHERE id = ${data};`;
        let sqladd = `DELETE FROM address WHERE address_id = ${data};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        db.run(sqluser, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        db.run(sqlacc, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdonedeluser`);
            console.log(sql);
        });
        db.run(sqladd, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdonedeluser`);
            console.log(sql);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
    } else {
        console.log("No reqs selected");
    }

    res.redirect('/admin/user-info');
});

router.post("/deluserregis", (req, res) => {
    const data = req.body.selectedid;

    
        let sql = `UPDATE room SET renter_id = NULL where renter_id = ${data};`;
        let sqluser = `DELETE FROM users WHERE user_id = ${data};`;
        let sqladd = `DELETE FROM address WHERE address_id = ${data};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        db.run(sqluser, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        db.run(sqladd, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdonedeluser`);
            console.log(sql);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
 

        res.status(200).json({ message: "ลบข้อมูลสำเร็จ" });
});

router.get("/getuser/:cid", (req, res) => {
    let cid = req.params.cid;
    let query = `SELECT users.user_id,users.id_number, users.title, users.name, users.surname, users.nickname, users.age, users.gender, users.nationality, users.religion, users.ethnicity, users.birthday, room.room_number FROM users join room on users.user_id = room.renter_id WHERE id_number = ?`;

    db.all(query, [cid], (err, rows) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(rows);
        res.json(rows);
    });
});

router.get("/getpopuser/:cid", (req, res) => {
    let cid = req.params.cid;
    let query = `SELECT users.user_id,users.id_number, users.title, users.name, users.surname, users.nickname, users.age, users.gender, users.nationality, users.religion, users.ethnicity, users.birthday, room.room_number FROM users join room on users.user_id = room.renter_id WHERE user_id = ?`;

    db.all(query, [cid], (err, rows) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(rows);
        res.json(rows);
    });
});

router.put("/updateuser/:id", async (req, res) => {
    const userId = req.params.id;
    const {
        account_id, address_id, address, road, tumbon, ket, province, post_id,
        phone, line, email, titlename, firstname, lastname,
        nickname, age, gender, nation, ciri, religion, dob
    } = req.body;

    const addressFormat = `${address}$${road}$${tumbon}$${ket}$${province}$${post_id}`;

    let sqlUser = `
        UPDATE users 
        SET title = ?, name = ?, surname = ?, nickname = ?, age = ?, gender = ?, 
            nationality = ?, religion = ?, ethnicity = ?, birthday = ? 
        WHERE user_id = ?
    `;

    let sqlAddress = `
        UPDATE address 
        SET address = ?, phone = ?, line = ?, email = ? 
        WHERE address_id = ?
    `;

    db.serialize(() => {
        db.run(sqlUser, [titlename, firstname, lastname, nickname, age, gender, nation, religion, ciri, dob, account_id], function (err) {
            if (err) {
                console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้:", err.message);
                return res.status(500).json({ error: "อัปเดตข้อมูลผู้ใช้ไม่สำเร็จ" });
            }
            console.log("อัปเดตข้อมูลผู้ใช้สำเร็จ");
        });

        db.run(sqlAddress, [addressFormat, phone, line, email, address_id], function (err) {
            if (err) {
                console.error("เกิดข้อผิดพลาดในการอัปเดตที่อยู่:", err.message);
                return res.status(500).json({ error: "อัปเดตที่อยู่ไม่สำเร็จ" });
            }
            console.log("อัปเดตที่อยู่สำเร็จ");

            // ส่ง response กลับไปเมื่อทุกอย่างเสร็จ
            res.json({ message: "อัปเดตข้อมูลสำเร็จ!" });
        });
    });
});

router.get("/getaddress/:cid", (req, res) => {
    let cid = req.params.cid;
    let query = `SELECT address.address_id, address, phone, line, email FROM address join users on users.address_id = address.address_id WHERE users.id_number = ?`;
    
    db.all(query, [cid], (err, rows) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(rows);
        res.json(rows);
    });

});

router.get("/getpopaddress/:cid", (req, res) => {
    let cid = req.params.cid;
    let query = `SELECT address.address_id, address, phone, line, email FROM address  WHERE address_id = ?`;

    db.all(query, [cid], (err, rows) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(rows);
        res.json(rows);
    });

});

router.post("/setregister", (req, res) => {
    const {
        account_id, address_id, address, road, tumbon, ket, province, post_id,
        phone, line, email, username, passw, cidss, titlename, firstname, lastname,
        nickname, age, gender, nation, ciri, religion, dob, otherText
    } = req.body;

    console.log("body id" + req.body);
    console.log("gender is"  + otherText)
    console.log(otherText)

    let finalGender = gender;
    if (gender === "A") {
        finalGender = otherText;
    }


    // สร้างที่อยู่ในรูปแบบที่ต้องการ
    const addressformat = `${address}$${road}$${tumbon}$${ket}$${province}$${post_id}`;

    // ใช้ prepared statements เพื่อป้องกัน SQL Injection
    let sql = `UPDATE users SET account_id = ?, title = ?, name = ?, surname = ?, nickname = ?, age = ?, nationality = ?, religion = ?, ethnicity = ?, birthday = ?, gender = ? WHERE id_number = ?`;
    let sqladdress = `UPDATE address SET address = ?, phone = ?, line = ?, email = ? WHERE address_id = ?`;
    let sqlaccount = `INSERT INTO account (id, username, password, isAdmin) VALUES (?, ?, ?, ?)`; // เพิ่มชื่อของตาราง (เช่น 'accounts')

    // บันทึกข้อมูลลงในฐานข้อมูล
    db.run(sql, [account_id, titlename, firstname, lastname, nickname, age, nation, religion, ciri, dob, finalGender,cidss], function (err) {
        if (err) {
        }
        console.log("User data updated successfully");
    });

    db.run(sqladdress, [addressformat, phone, line, email, address_id], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log("Address data updated successfully");
    });
    let iii = 0;
    db.run(sqlaccount, [account_id, username, passw, iii], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log("Account data inserted successfully");
    });

    res.redirect('/admin/register');
});



router.get("/admin/contact", (req, res) => {
    const query = `SELECT contact_staff.contact_id, room.room_number, contact_staff.contact_name, contact_staff.pic, contact_staff.date, contact_staff.time from contact_staff join room on contact_staff.room_id = room.room_id where contact_staff.status = 0;`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('contact', { data: rows });
    });
});

router.get("/admin/payment", (req, res) => {
    const query = `SELECT bill.date AS bill_date ,bill.isPaid,room.room_number, payment.bill_id, payment.pic, payment.date, payment.time from payment join bill on payment.bill_id = bill.bill_id JOIN room ON bill.room_id = room.room_id;`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('payment', { data: rows });
    });
});

router.get("/admin/news", (req, res) => {
    const query = `select * from news`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('news', { data: rows });
    });
});


router.get("/admin/popup-news", (req, res) => {
    res.render('popup-news');
});


router.get("/admin/popup-user-info", (req, res) => {
    // let user_id = req.params.id;
    // let query = ``
    res.render('popup-user-info');
});

router.get("/admin/register", (req, res) => {
    res.render('register');
});

router.get("/admin/report", (req, res) => {
    const query = `SELECT repairReq.id,  room.room_number, repairReq.info, repairReq.pic, repairReq.date, repairReq.time from repairReq join room on repairReq.room_id = room.room_id where repairReq.isDone = 0; `;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('report', { data: rows });
    });
});

router.get("/admin/services", (req, res) => {
    const query = `SELECT servicesReq.id, room.room_number, service.name_service, servicesReq.date, servicesReq.time, servicesReq.info FROM servicesReq JOIN service ON servicesReq.service_id = service.service_id JOIN room ON servicesReq.room_id = room.room_id WHERE servicesReq.isDone = 0;`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('services', { data: rows });
    });
});

router.get("/admin/send-bill", (req, res) => {
    const query = `SELECT  room_number, renter_id from room where renter_id IS NOT NULL`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('send-bill', { data: rows });
    });
});

router.post("/submitReqService", (req, res) => {
    const selectedRooms = req.body.selectedReqs; // รับค่าจาก checkbox

    if (Array.isArray(selectedRooms)) {
        for (let i = 0; i < selectedRooms.length; i++) {
            let sql = `UPDATE servicesReq SET isDone = 1 WHERE id = ${selectedRooms[i]};`;
            db.run(sql, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdone`);
                console.log(sql);
            });
        }


    } else if (selectedRooms) {
        let sql = `UPDATE servicesReq SET isDone = 1 WHERE id = ${selectedRooms};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
    } else {
        console.log("No reqs selected");
    }

    res.redirect('/admin/services');
});

router.post("/submitReqRepair", (req, res) => {
    const selectedRepair = req.body.selectedRepair; // รับค่าจาก checkbox

    if (Array.isArray(selectedRepair)) {
        for (let i = 0; i < selectedRepair.length; i++) {
            let sql = `UPDATE repairReq SET isDone = 1 WHERE id = ${selectedRepair[i]};`;
            db.run(sql, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdone`);
                console.log(sql);
            });
        }


    } else if (selectedRepair) {
        let sql = `UPDATE repairReq SET isDone = 1 WHERE id = ${selectedRepair};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
    } else {
        console.log("No reqs selected");
    }

    res.redirect('/admin/report');
});

router.post("/submitContact", (req, res) => {
    const selectedContact = req.body.selectedContact; // รับค่าจาก checkbox

    if (Array.isArray(selectedContact)) {
        for (let i = 0; i < selectedContact.length; i++) {
            let sql = `UPDATE contact_staff SET status = 1 WHERE contact_id = ${selectedContact[i]};`;
            db.run(sql, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdone`);
                console.log(sql);
            });
        }

    } else if (selectedContact) {
        let sql = `UPDATE contact_staff SET status = 1 WHERE contact_id = ${selectedContact};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
    } else {
        console.log("No reqs selected");
    }

    res.redirect('/admin/contact');
});


router.post("/submitshownews", (req, res) => {
    const selectednews = req.body.selectednews; // รับค่าจาก checkbox

    if (Array.isArray(selectednews)) {
        for (let i = 0; i < selectednews.length; i++) {
            let sql = `UPDATE news SET status = 1 WHERE new_id = ${selectednews[i]};`;
            db.run(sql, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdone`);
                console.log(sql);
            });
        }

    } else if (selectednews) {
        let sql = `UPDATE news SET status = 1 WHERE new_id = ${selectednews};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
    } else {
        console.log("No reqs selected");
    }

    res.redirect('/admin/news');
});

router.post("/submitdelnews", (req, res) => {
    const selectednews = req.body.selectednews; // รับค่าจาก checkbox

    if (Array.isArray(selectednews)) {
        for (let i = 0; i < selectednews.length; i++) {
            let sql = `DELETE FROM news WHERE new_id = ${selectednews[i]};`;
            db.run(sql, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdone`);
                console.log(sql);
            });
        }

    } else if (selectednews) {
        let sql = `DELETE FROM news WHERE new_id = ${selectednews};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
    } else {
        console.log("No reqs selected");
    }

    res.redirect('/admin/news');
});

router.post("/submitbill", (req, res) => {
    const selectednews = req.body.selectbill; // รับค่าจาก checkbox

    if (Array.isArray(selectednews)) {
        for (let i = 0; i < selectednews.length; i++) {
            let sql = `UPDATE bill SET isPaid = 1 where bill_id = ${selectednews[i]};`;
            db.run(sql, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`isdone`);
                console.log(sql);
            });
        }

    } else if (selectednews) {
        let sql = `UPDATE bill SET isPaid = 1 where bill_id = ${selectednews};`;
        db.run(sql, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`isdone`);
        });
        console.log(sql); // กรณีเลือกแค่ 1 อัน
    } else {
        console.log("No reqs selected");
    }

    res.redirect('/admin/payment');
});

router.post("/createbill", (req, res) => {



    //โค้ดกูน่าฝากใส่กลับ createbill ด้วย
    db.all("SELECT bill_id FROM bill ORDER BY bill_id DESC LIMIT 1", [], (err, row) => {
        if (err) {
            console.error(err.message);
        }

        if (row) {
            const latestBillId = row[0].bill_id;
            db.run(
                "INSERT INTO payment (bill_id, pic, date, time) VALUES (?, 'none', CURRENT_DATE, CURRENT_TIME)", [latestBillId], (err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("Inserted payment for bill_id:", latestBillId);
                    }
                }
            );

        } else {
            console.log("No records found in bill table.");
        }
        res.json({ data: "dd" });
    });
});

router.get("/admin/write-bill/:id", (req, res) => {
    let id = req.params.id;
    query = `select room.room_id, room.price,room.room_number, users.name, users.surname from users join room on users.user_id = room.renter_id where user_id = ?`
    db.all(query,[id], (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        console.log(rows);
        res.render('write-bill', { data: rows });
    });
});

router.post("/submitaddNews", (req, res) => {
    const data = req.body;
    db.run("INSERT INTO news (new_name, info, date, time, pic) VALUES (?, ?, ?, ?, ?)",
        [data.title, data.info, data.date, data.time, data.filebase642], (err) => {
            if (err) {
                console.error("Error inserting new request:", err);
            } else {
                console.log("New request inserted successfully");
            }
        });
});



router.put("/updatenews/:newsId", (req, res) => {
    const newsId = req.params.newsId;
    const { status } = req.body; // รับค่า status

    // ตัวอย่าง SQL Update
    const query = "UPDATE news SET status = ? WHERE new_id = ?";
    db.run(query, [status, newsId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database update failed" });
        }
        res.json({ success: true, message: "Status updated successfully" });
        console.log(newsId + " status: " + status);
    });
});

router.put("/insertbill/:roomid", (req, res) => {
    const roomid = req.params.roomid;
    const data = req.body; // รับค่า status
    console.log(roomid, data.roomwage, data.wateruse, data.elecuse, data.fine, data.finewage, data.total, 0,  data.date);
    // ตัวอย่าง SQL Update
    const query = "insert into bill (room_id, room_price, wate, elec, fine_info, fine, total, isPaid, date, service) values (?,?,?,?,?,?,?,?,?,?)";
    db.run(query, [roomid, data.roomwage, data.wateruse, data.elecuse, data.fine, data.finewage, data.total, 0,  data.date, data.servicewage], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database update failed" });
        }
        res.json({ success: true, message: "Status updated successfully" });
        console.log(roomid, data.roomwage, data.wateruse, data.elecuse, data.fine, data.finewage, data.total, 0,  data.date, data.servicewage);
    });
});

router.put("/updatebill/:newsId", (req, res) => {
    const newsId = req.params.newsId;
    const { status } = req.body; // รับค่า status

    // ตัวอย่าง SQL Update
    const query = "UPDATE bill SET isPaid = ? WHERE bill_id = ?";
    db.run(query, [status, newsId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database update failed" });
        }
        res.json({ success: true, message: "Status updated successfully" });
        console.log(newsId + " status: " + status);
    });
});


router.delete("/delbill/:id", (req, res) => {
    const bill_id = req.params.id;

    // ตัวอย่าง SQL Update
    const query = `DELETE FROM bill WHERE bill_id = ?;`;
    db.run(query, [bill_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database update failed" });
        }
        res.json({ success: true, message: "delete bill successfully" });
        console.log(bill_id);
    });
});


module.exports = router;