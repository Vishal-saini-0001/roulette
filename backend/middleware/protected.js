const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const asynchandler = require("express-async-handler");

const protect = asynchandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("User Unauthorized! Please login");
    }

    const verfiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(verfiedToken.id).select("-password");
    if (!user) {
      res.status(400);
      throw new Error("User Not Found");
    }
    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("User Unauthorized! Please login");
  }
});

module.exports = protect;
