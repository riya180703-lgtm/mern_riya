const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET || "dev_secret_change_me", {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });

  return res.status(200).json({
    success: true,
    token,
    admin: { username },
  });
};

module.exports = { login };
