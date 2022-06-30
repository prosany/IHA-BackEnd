const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const { PORT } = require("./Config");

const app = express();

// Database Connection
require("./Config/DatabaseConfigrations");

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PATCH,PUT,DELETE",
    credentials: true,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  })
);
app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));

// Routes
app.get("/", async (req, res, next) => {
  res.status(200).send({
    status: 1,
    message: "🎉 Congratulations! Your Server Works Perfectly! 🎉",
  });
});

// Routes
app.use("/api", require("./Routes/Auth.Routes"));
app.use("/api", require("./Routes/Bill.Routes"));

// Error Handling
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: 0,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🎉 Server Up & Running... On PORT http://localhost:${PORT} 🎉`);
});
