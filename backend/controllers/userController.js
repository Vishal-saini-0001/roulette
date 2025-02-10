const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

//token genterator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};
//register
const register = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  // validations
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Fill All Fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password Must be more than 6 Characters");
  }
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }

  //hashing password
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashPassword,
  });
  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
  });

  res.status(200).json({ user, token });
});
//login
const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  //validations
  if (!email || !password) {
    res.status(400);
    throw new Error("Enter All Fields");
  }

  const existUser = await userModel.findOne({ email });
  if (!existUser) {
    res.status(400);
    throw new Error("Email not exist! Register First");
  }

  // comparing password
  const correctPassword = await bcrypt.compare(password, existUser.password);

  const token = generateToken(existUser._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
  });
  if (!correctPassword) {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
  if (existUser && correctPassword) {
    const { username, email, password, profilePhoto, accountBalance } =
      existUser;
    res
      .status(201)
      .json({ username, email, password, profilePhoto, accountBalance, token });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});
//logout
const logout = asynchandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  return res.status(201).json({ message: "Logout Successfully" });
});
//getuser details
const getUser = asynchandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.json({ user });
});

module.exports = { register, login, logout, getUser };
