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
    res.render('contact');
});

router.get("/payment", (req,res) => {
    res.render('payment');
});

router.get("/news", (req,res) => {
    res.render('news');
});

router.get("/popup-user-info", (req,res) => {
    res.render('popup-user-info');
});

router.get("/register", (req,res) => {
    res.render('register');
});

router.get("/report", (req,res) => {
    res.render('report');
});

router.get("/services", (req,res) => {
    res.render('services');
});





module.exports = router;