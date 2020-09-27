const express = require('express');

const shopsControllers = require('../../controllers/mobile/shops-controllers');

const router = express.Router();

router.get('/shoplist/:cname', shopsControllers.getShopByCity);

module.exports = router;