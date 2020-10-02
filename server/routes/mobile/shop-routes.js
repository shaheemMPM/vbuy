const express = require('express');

const shopsControllers = require('../../controllers/mobile/shops-controllers');
const checkAuth = require('../../middlewares/check-isuser');

const router = express.Router();

router.use(checkAuth);

router.get('/shoplist/:cname', shopsControllers.getShopByCity);

module.exports = router;