const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// เชื่อมต่อกับ SQLite Database
const db = new sqlite3.Database(path.join(__dirname, "Web.db"), (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

module.exports = db;
