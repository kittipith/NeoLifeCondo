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

router.get("/admis", (req, res) => {
    res.render('admin');
});

router.get("/user-info", (req,res) => {

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

router.get("/contact", (req,res) => {
    const query = `SELECT room.room_number, contact_staff.contact_name, contact_staff.pic, contact_staff.date, contact_staff.time from contact_staff join room on contact_staff.room_id = room.room_id`;
    db.all(query, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      console.log(rows);
      res.render('contact', { data : rows });
    });
});

router.get("/payment", (req,res) => {
    const query = `SELECT room.room_number, payment.bill_id, payment.pic, payment.date, payment.time from payment join bill on payment.bill_id = bill.bill_id JOIN room ON bill.room_id = room.room_id;` ;
    db.all(query, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      console.log(rows);
      res.render('payment', { data : rows });
    });
});

router.get("/news", (req,res) => {
    const query = `select * from news`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    res.render('news', { data : rows });
  });
});

router.get("/popup-user-info", (req,res) => {
    res.render('popup-user-info');
});

router.get("/register", (req,res) => {
    res.render('register');
});

router.get("/report", (req,res) => {
    const query = `SELECT room.room_number, repairReq.info, repairReq.pic, repairReq.date, repairReq.time from repairReq join room on repairReq.room_id = room.room_id`;
    db.all(query, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      console.log(rows);
      res.render('report', { data : rows });
    });
});

router.get("/services", (req,res) => {
    const query = `SELECT room.room_number, service.name_service, servicesReq.date, servicesReq.time, servicesReq.info FROM servicesReq JOIN service ON servicesReq.service_id = service.service_id JOIN room ON servicesReq.room_id = room.room_id;`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    res.render('services', { data : rows });
  });
});





module.exports = router;