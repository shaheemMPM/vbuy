const { validationResult } = require("express-validator");

const HttpError = require("../../models/http-error");
const Products = require("../../models/products");
const Offers = require("../../models/offers");

const getPopularProductsAndOffers = async (req, res, next) => {
  let popularProducts;
  let shopId = req.params.sid;

  try {
    popularProducts = await Products.find({
      shopId: shopId,
      popular: true,
      isActive: true,
    });
  } catch (error) {
    return next(new HttpError("Reading products failed.", 500));
  }

  let offers;

  try {
    offers = await Offers.find({ shopId: shopId });
  } catch (error) {
    return next(new HttpError("Reading offers failed.", 500));
  }

  res.status(200).json({ popularProducts, offers });
};

exports.getPopularProductsAndOffers = getPopularProductsAndOffers;
