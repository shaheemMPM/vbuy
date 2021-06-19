const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, "nexero_super_boys_supersecret_key");
    req.adminData = {
      adminId: decodedToken.adminId,
      email: decodedToken.email,
    };
    if (decodedToken.email !== "admin@vbuy.com") {
      throw new Error("Authentication failed!");
    }
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
