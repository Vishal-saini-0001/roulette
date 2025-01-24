const express = require("express");
const userController = require("../controllers/userController");
const betController = require("../controllers/betController");
const protect = require("../middleware/protected");
const Router = express.Router();
const Staticbets = require("../controllers/StaticBets")

//user routes
Router.post("/register", userController.register);
Router.post("/login", userController.login);
Router.get("/logout", userController.logout);
Router.get("/getUser", protect, userController.getUser);

//bets route
Router.post("/bets", protect, betController.bets);
Router.post("/Staticbets" , Staticbets.Staticbets);

module.exports = Router;
