const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const { JWT_SECRET } = require("../Config");

const signToken = (user_id) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      { user_id },
      JWT_SECRET,
      { expiresIn: "1d", issuer: "Instructor Hiring App", audience: user_id },
      (err, token) => {
        if (err) return reject(createError.InternalServerError());
        resolve(token);
      }
    );
  });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return next(createError.Unauthorized());

  token = token.split(" ")[1];

  JWT.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(createError(401, "Invalid token"));
    req.user_id = decoded.aud;
    next();
  });
};

module.exports = { signToken, verifyToken };
