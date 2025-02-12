const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// ✅ Import Routes
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const user = require("./routes/user");
const admin = require("./routes/admin");

app.use("/", authRoutes);
app.use("/", protectedRoutes);
app.use("/", user);
app.use("/", admin);

// ✅ เปิดเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});