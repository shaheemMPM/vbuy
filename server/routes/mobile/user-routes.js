const express = require('express');
const { check } = require('express-validator');

const userController = require('../../controllers/mobile/user-controllers');

const router = express.Router();

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 8 })
  ],
  userController.signup
);

router.post(
  '/login', 
  [
    check('email').isEmail(),
    check('password').isLength({ min: 8 })
  ],
  userController.login
);

module.exports = router;
