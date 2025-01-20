const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Enter Username"],
  },
  email: {
    type: String,
    required: [true, "Email required!"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please Enter a valid password"],
    minLength: [6, "Password must be more than 6 Characters"],
  },
  profilePhoto: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  },
  accountBalance: {
    type: Number,
    default: 5000,
  },
  totalBets: {
    type: Number,
    default: 0,
  },
  lastBets: [],
});

const user = mongoose.model("user", userSchema);
module.exports = user;
