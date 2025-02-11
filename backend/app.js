const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const chalk = require("chalk");
const route = require("./routes/route");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");

app.use(cors());
// {
//   origin: "http://localhost:5173", // Allow frontend
//   credentials: true, // Allow cookies/sessions
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use("/api", route);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(chalk.cyanBright("Server is running on port", PORT));
  });
});
