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

const allowedOrigins = [
  "http://localhost:5173",
  "https://roulette.studioubique-dev.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  })
);
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
