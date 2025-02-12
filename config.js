const ACCESS_SECRET = "access_secret_key";
const REFRESH_SECRET = "refresh_secret_key";

const refreshTokens = new Set();

const users = [
  { id: "1", username: "boss", password: "1234", isAdmin: true },
  { id: "2", username: "title", password: "4321", isAdmin: false },
];

module.exports = { ACCESS_SECRET, REFRESH_SECRET, refreshTokens, users };
