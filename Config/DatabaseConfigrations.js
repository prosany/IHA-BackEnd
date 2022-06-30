const mongoose = require("mongoose");
const { APP_ENV, DB_URL, DB_NAME, DB_USER, DB_PASSWORD } = require(".");

const mongooseDB_URI =
  APP_ENV === "development"
    ? `mongodb://${DB_URL}/${DB_NAME}`
    : `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongooseDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successful."))
  .catch((err) => console.log("Connection Failed, ", err.message));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to Database");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from Database");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
