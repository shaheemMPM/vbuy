const express = require("express");
const { check } = require("express-validator");

const userController = require("../../controllers/mobile/user-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("place").not().isEmpty(),
  ],
  userController.signup
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 8 })],
  userController.login
);

router.post(
  "/forgotpassword",
  [check("email").isEmail()],
  userController.resetPassword
);

router.post(
  "/changepassword",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
    check("newPassword").isLength({ min: 8 }),
  ],
  userController.changePassword
);

module.exports = router;
