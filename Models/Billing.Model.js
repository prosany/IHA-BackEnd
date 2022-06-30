const { Schema, model } = require("mongoose");
const UUIDs = require("../Helpers/UUIDs");

const billingSchema = new Schema(
  {
    billing_id: {
      type: String,
      required: true,
      unique: true,
      default: () => UUIDs(15),
    },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paid_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Billing = model("billing", billingSchema);

module.exports = Billing;
