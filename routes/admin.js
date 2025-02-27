const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../database/database");

const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");



// 📌 ADMIN ROUTE
// router.get("/admin-login", (req, res) => {
//     res.render('admin-login', {data :'none'});
// });

router.get("/admin", (req, res) => {
    res.render('admin');
});

router.get("/admin/user-info", (req,res) => {

    const query = `SELECT room.room_number, users.title, users.name, users.surname, address.phone, address.line
FROM room JOIN users ON room.renter_id = users.user_id JOIN address ON users.address_id = address.address_id;`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    res.render('user-info', { data : rows });
  });
});

router.get("/getcid", (req, res) => {
  let query = `select id_number from users`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    res.json(rows);
  });
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

router.post("/setregister", (req, res) => {
  const { 
    account_id, address_id, address, road, tumbon, ket, province, post_id, 
    phone, line, email, username, passw, cidss, titlename, firstname, lastname, 
    nickname, age, gender, nation, ciri, religion, dob 
  } = req.body;

  // สร้างที่อยู่ในรูปแบบที่ต้องการ
  const addressformat = `${address}$${road}$${tumbon}$${ket}$${province}$${post_id}`;

  // ใช้ prepared statements เพื่อป้องกัน SQL Injection
  let sql = `UPDATE users SET account_id = ?, title = ?, name = ?, surname = ?, nickname = ?, age = ?, nationality = ?, religion = ?, ethnicity = ?, birthday = ? WHERE id_number = ?`;
  let sqladdress = `UPDATE address SET address = ?, phone = ?, line = ?, email = ? WHERE address_id = ?`;
  let sqlaccount = `INSERT INTO account (id, username, password, isAdmin) VALUES (?, ?, ?, ?)`; // เพิ่มชื่อของตาราง (เช่น 'accounts')

  // บันทึกข้อมูลลงในฐานข้อมูล
  db.run(sql, [account_id,titlename, firstname, lastname, nickname, age, nation, religion, ciri, dob, cidss], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log("User data updated successfully");
  });

  db.run(sqladdress, [addressformat, phone, line, email, address_id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log("Address data updated successfully");
  });
  let iii = 0;
  db.run(sqlaccount, [account_id, username, passw, iii], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log("Account data inserted successfully");
  });

  res.redirect('/admin/register');
});



router.get("/admin/contact", (req,res) => {
    const query = `SELECT contact_staff.contact_id, room.room_number, contact_staff.contact_name, contact_staff.pic, contact_staff.date, contact_staff.time from contact_staff join room on contact_staff.room_id = room.room_id where contact_staff.status = 0;`;
    db.all(query, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      console.log(rows);
      res.render('contact', { data : rows });
    });
});

router.get("/admin/payment", (req,res) => {
    const query = `SELECT room.room_number, payment.bill_id, payment.pic, payment.date, payment.time from payment join bill on payment.bill_id = bill.bill_id JOIN room ON bill.room_id = room.room_id;` ;
    db.all(query, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      console.log(rows);
      res.render('payment', { data : rows });
    });
});

router.get("/admin/news", (req,res) => {
    const query = `select * from news`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    res.render('news', { data : rows });
  });
});

router.get("/admin/popup-user-info", (req,res) => {
    res.render('popup-user-info');
});

router.get("/admin/register", (req,res) => {
    res.render('register');
});

router.get("/admin/report", (req,res) => {
    const query = `SELECT repairReq.id,  room.room_number, repairReq.info, repairReq.pic, repairReq.date, repairReq.time from repairReq join room on repairReq.room_id = room.room_id where repairReq.isDone = 0; `;
    db.all(query, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      console.log(rows);
      res.render('report', { data : rows });
    });
});

router.get("/admin/services", (req,res) => {
    const query = `SELECT servicesReq.id, room.room_number, service.name_service, servicesReq.date, servicesReq.time, servicesReq.info FROM servicesReq JOIN service ON servicesReq.service_id = service.service_id JOIN room ON servicesReq.room_id = room.room_id WHERE servicesReq.isDone = 0;`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    res.render('services', { data : rows });
  });
});

router.post("/submitReqService", (req, res) => {
  const selectedRooms = req.body.selectedReqs; // รับค่าจาก checkbox

  if (Array.isArray(selectedRooms)) {
    for(let i=0; i < selectedRooms.length; i++){
      let sql = `UPDATE servicesReq SET isDone = 1 WHERE id = ${selectedRooms[i]};`;
    db.run(sql, function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`isdone`);
      console.log(sql);
    });
    }
    
    
  } else if (selectedRooms) {
    let sql = `UPDATE servicesReq SET isDone = 1 WHERE id = ${selectedRooms};`;
    db.run(sql, function(err) {
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
    for(let i=0; i < selectedRepair.length; i++){
      let sql = `UPDATE repairReq SET isDone = 1 WHERE id = ${selectedRepair[i]};`;
    db.run(sql, function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`isdone`);
      console.log(sql);
    });
    }
    
    
  } else if (selectedRepair) {
    let sql = `UPDATE repairReq SET isDone = 1 WHERE id = ${selectedRepair};`;
    db.run(sql, function(err) {
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
    for(let i=0; i < selectedContact.length; i++){
      let sql = `UPDATE contact_staff SET status = 1 WHERE contact_id = ${selectedContact[i]};`;
    db.run(sql, function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`isdone`);
      console.log(sql);
    });
    }
    
    
  } else if (selectedContact) {
    let sql = `UPDATE contact_staff SET status = 1 WHERE contact_id = ${selectedContact};`;
    db.run(sql, function(err) {
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







module.exports = router;