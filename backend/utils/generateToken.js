const jwt = require("jsonwebtoken");

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "lamborghini_super_secret_key_2024_change_in_production", {
    expiresIn: "30d",
  });
}

module.exports = generateToken;