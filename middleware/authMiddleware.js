const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../config");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
}

module.exports = { verifyToken };
