const { Schema, model } = require("mongoose");
const UUIDs = require("../Helpers/UUIDs");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
      unique: true,
      default: () => UUIDs(15),
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;
