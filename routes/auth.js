const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../database/database");

const { ACCESS_SECRET, REFRESH_SECRET, refreshTokens, users, checkUserCredentials} = require("../config");

const router = express.Router();

//ฟังก์ชันสร้าง Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, ACCESS_SECRET, { expiresIn: "30s" });
};

//ฟังก์ชันสร้าง Refresh Token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, REFRESH_SECRET, { expiresIn: "7d" });
    refreshTokens.add(refreshToken);
    return refreshToken;
};

//LOGIN
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../website/templates/login.html'));
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    // console.log(users);
    checkUserCredentials(username, password)
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "strict" });
        res.json({ accessToken });
    })
    .catch(err => {
        console.error("Error checking credentials:", err);
        res.status(500).json({ message: "Internal server error" });
    });
});

//REFRESH TOKEN
router.post("/refresh", (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
        return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
});

//LOGOUT
router.post("/logout", (req, res) => {
    const { refreshToken } = req.cookies;
    refreshTokens.delete(refreshToken);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
});

// FORGOT
router.get("/forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, '../website/templates/forgot-password-2.html'));
});

router.post("/forgot-password", (req, res) => {
    try {
        const { idCard, username, password } = req.body;

        if (!idCard || !username || !password) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        const idCard2 = idCard.slice(0, 1) + '-' + idCard.slice(1, 5) + '-' + idCard.slice(5, 10) + '-' +  idCard.slice(10, 12) + '-' + idCard.slice(12);


        db.all("UPDATE account SET password = ? WHERE id = (SELECT account.id FROM account JOIN users ON account.id = users.account_id WHERE id_number = ?) AND username = ?", [password, idCard2, username], (err, account_id) => {
            console.log("User data:", account_id);
            res.status(200).json({ success: "อัปเดตข้อมูลเสร็จสิ้น"})
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});

module.exports = router;
