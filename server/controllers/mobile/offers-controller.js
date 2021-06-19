const { validationResult } = require("express-validator");

const HttpError = require("../../models/http-error");
const Offers = require("../../models/offers");
const Products = require("../../models/products");

const getOffersByShopId = async (req, res, next) => {
  let shopId = req.params.sid;
  let offers;

  try {
    offers = await Offers.find({ shopId: shopId }).select(
      "name image percentage"
    );
  } catch (error) {
    return next(new HttpError("Reading offers failed.", 500));
  }

  res.status(200).json({ offers });
};

const getProducts = async (req, res, next) => {
  let offerId = req.params.oid;
  let products;

  try {
    products = await Products.find({ offerId: offerId, isActive: true }).select(
      "name description image amount offer offerPrice"
    );
  } catch (error) {
    return next(new HttpError("Reading products failed.", 500));
  }

  res.status(200).json({ products });
};

exports.getOffersByShopId = getOffersByShopId;
exports.getProducts = getProducts;
