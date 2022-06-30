const createError = require("http-errors");
const User = require("../Models/Auth.Model");
const bcrypt = require("bcrypt");
const { signToken } = require("../Helpers/JWT");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return next(createError(401, "User not registered"));

    // Check if password is correct
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) return next(createError(401, "Invalid login credentials"));

    const token = await signToken(user.user_id);

    // Store Cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    // Send user data
    res.status(200).send({
      status: 1,
      message: "Login successful",
      access_token: token,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) return next(createError(409, "User already registered"));

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const createUser = new User({
      email,
      password: hashedPassword,
    });

    // Save user
    const savedUser = await createUser.save();
    console.log("🍂 🍃 | register | savedUser", savedUser);

    // Token
    const token = await signToken(savedUser.user_id);

    // Store Cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Send user data
    res.status(201).send({
      status: 1,
      message: "User created successfully",
      access_token: token,
      email: savedUser.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register };
