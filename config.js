const path = require("path");
const db = require("./database/database");

const ACCESS_SECRET = "access_secret_key";
const REFRESH_SECRET = "refresh_secret_key";

const refreshTokens = new Set();

const checkUserCredentials = (username, password) => {
  return new Promise((resolve, reject) => {
    // ใช้คำสั่ง SQL เพื่อค้นหาผู้ใช้ในฐานข้อมูลที่ตรงกับ username และ password
    db.get("SELECT * FROM account WHERE username = ? AND password = ?", [username, password], (err, row) => {
      if (err) {
        reject(err);  // ถ้ามีข้อผิดพลาดในการค้นหาผู้ใช้
      } else {
        if (row) {
          resolve(row);  // ถ้าพบผู้ใช้คืนค่าเป็นข้อมูลผู้ใช้
        } else {
          resolve(null); // ถ้าไม่พบผู้ใช้
        }
      }
    });
  });
};

module.exports = { ACCESS_SECRET, REFRESH_SECRET, refreshTokens, checkUserCredentials};
