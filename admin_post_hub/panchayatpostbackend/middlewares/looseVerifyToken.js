const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function auth(req, res, next) {
  try {
    const rawToken = req.header("Authorization") || req.header("auth-token");
    if (rawToken && rawToken !== "null" && rawToken !== "undefined" && Boolean(rawToken)) {
      const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;
      const verified = jwt.verify(token, process.env.JWT_SECRET || "festivalappjwtsecret");
      if (verified && verified._id) {
        req.userId = verified._id;
        const users = await User.findOne({ _id: verified._id });
        if (users) {
          req.userType = users.userType;
          req.standardId = users.selectedStandardId;
          req.language = users.selectedLanguage === 'gujarati' ? users.selectedLanguage : 'english';
          req.branchId = users.selectedBranchId;
        }
      }
    }
  } catch (_) {
    // Non-blocking: guests can continue to load public content
  }
  next();
}

module.exports = auth;
