const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

//Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // รองรับข้อมูลจาก Form

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "website/views")); // โฟลเดอร์เก็บไฟล์ .ejs
app.use(express.static(path.join(__dirname, "website"))); // static

//Import Routes
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const user = require("./routes/user");
const user2 = require("./routes/user-login");
const admin = require("./routes/admin");

app.use("/", authRoutes);
app.use("/", protectedRoutes);
app.use("/", user);
app.use("/", user2);
app.use("/", admin);

//เปิดเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});