const express = require('express');
const { check } = require('express-validator');

const adminController = require('../../controllers/admin-controllers');

const router = express.Router();

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  adminController.signup
);

router.post('/login', adminController.login);

module.exports = router;
