const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const router = express.Router();
const { users, REFRESH_SECRET } = require("../config");
const { verifyToken } = require("../middleware/authMiddleware");


// 📌 ADMIN ROUTE
// router.get("/show", (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/test.html'));
// });

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../website/templates/test.html'));
})

// 📌 แสดงข้อมูล USER
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