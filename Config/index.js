require("dotenv").config();
const Config = {};

Config.PORT = process.env.PORT || 7645;
Config.APP_ENV = process.env.APP_ENV;
Config.DB_URL = process.env.DB_URL;
Config.DB_NAME = process.env.DB_NAME;
Config.DB_PASSWORD = process.env.DB_PASSWORD;
Config.DB_USER = process.env.DB_USER;
Config.JWT_SECRET = process.env.JWT_SECRET;

module.exports = Config;
