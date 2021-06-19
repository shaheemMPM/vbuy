const express = require("express");

const userContrallers = require("../../controllers/dashboard/user-controllers");

const router = express.Router();

router.get("/", userContrallers.getUsers);

router.get("/:uid", userContrallers.getUserById);

module.exports = router;
