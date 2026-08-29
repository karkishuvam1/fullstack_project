const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "lamborghini_super_secret_key_2024_change_in_production"
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User account no longer exists." });
      }

      return next();
    } catch (error) {
      console.error("Auth Token Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed or expired." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no authentication token provided." });
  }
}

async function optionalAuth(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "lamborghini_super_secret_key_2024_change_in_production"
      );
      req.user = await User.findById(decoded.id).select("-password");
    } catch (_) {
      req.user = null;
    }
  }
  next();
}

async function admin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Administrator access required." });
  }
}

module.exports = { protect, optionalAuth, admin };
