const { Router } = require("express");
const { login, register } = require("../Controllers/Auth.Controller");
const router = Router();

router.post("/login", login);
router.post("/registration", register);

module.exports = router;
