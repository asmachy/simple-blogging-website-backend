const express = require('express');
const router = express.Router();
const queryUserHelper = require("../helper/query.user.helper");
const userController = require("../controllers/user.controller");

router.post('/login', [queryUserHelper.isValidUserInfo], userController.login);
router.post('/register',[queryUserHelper.isValidNewUserInfo], userController.createUser);

module.exports = router;