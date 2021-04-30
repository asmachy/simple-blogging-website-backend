const express = require('express');
const router = express.Router();
const queryUserHelper = require("../helpers/query.user.helper");
const userController = require("../controllers/user.controller");

router.post('/login', [queryUserHelper.isValidLoginFormat], userController.login);
router.post('/register',[queryUserHelper.isValidRegistrationFormat], userController.createUser);

module.exports = router;