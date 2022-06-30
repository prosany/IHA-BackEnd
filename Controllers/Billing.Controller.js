const createError = require("http-errors");
const User = require("../Models/Auth.Model");
const Billing = require("../Models/Billing.Model");

// Find All Billings
const userBilling = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user_id });
    if (!user) return next(createError(401, "Access Denied"));

    let { page, limit, search } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    const limited = parseInt(limit);
    const skip = parseInt(page - 1) * limited;

    const options = !search
      ? { user_id: req.user_id }
      : {
          user_id: req.user_id,
          $or: [
            { full_name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        };

    const bills = await Billing.find(options)
      .limit(limited)
      .skip(skip)
      .select("-__v -_id")
      .sort({
        updatedAt: -1,
      });

    // Total Count
    const total = await Billing.find({
      user_id: user.user_id,
    }).countDocuments();

    res.status(200).send({
      status: 1,
      message:
        bills?.length <= 0
          ? "No Billing Found"
          : "Successfully Fetched Billing.",
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
      },
      results: bills,
    });
  } catch (error) {
    next(error);
  }
};

// create new bill
const addBill = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user_id });
    if (!user) return next(createError(401, "Access Denied"));

    const { full_name, email, phone, paid_amount } = req.body;

    const createBill = new Billing({
      full_name,
      email,
      phone,
      paid_amount,
      user_id: req.user_id,
    });

    await createBill.save();

    res.status(201).send({
      status: 1,
      message: "Bill Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Bill
const editBill = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user_id });
    if (!user) return next(createError(401, "Access Denied"));

    const { bill_id } = req.params;

    const updateBill = await Billing.findOneAndUpdate(
      { billing_id: bill_id, user_id: user.user_id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updateBill) return next(createError(404, "Bill Not Found"));

    res.status(200).send({
      status: 1,
      message: "Bill Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Bill
const deleteBill = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user_id });
    if (!user) return next(createError(401, "Access Denied"));

    const { bill_id } = req.params;

    const deleteBill = await Billing.findOneAndDelete({
      billing_id: bill_id,
      user_id: user.user_id,
    });

    if (!deleteBill) return next(createError(404, "Bill Not Found"));

    res.status(200).send({
      status: 1,
      message: "Bill Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userBilling,
  addBill,
  editBill,
  deleteBill,
};
