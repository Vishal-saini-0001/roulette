const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(chalk.cyanBright("MongoDb connected!"));
  } catch (error) {
    console.log(chalk.red("MongoDb connection failed!", error));
  }
};

module.exports = connectDB;
