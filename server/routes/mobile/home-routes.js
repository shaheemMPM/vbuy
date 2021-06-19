const express = require("express");

const homeControllers = require("../../controllers/mobile/home-controllers");

const router = express.Router();

router.get("/:sid", homeControllers.getPopularProductsAndOffers);

module.exports = router;
