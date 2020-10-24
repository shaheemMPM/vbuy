const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Shops = require('../../models/shops');
const Category = require('../../models/categories');
const SubCategory = require('../../models/subcategories');
const Products = require('../../models/products');

const getShops = async (req, res, next) => {
  let shops;
  try {
    shops = await Shops.find();
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find shops.', 500));
  }
  res.status(200).json({shops});
}

const getShopById = async (req, res, next) => {
  const shopId = req.params.sid;

  let shop;

  try {
    shop = await Shops.findById(shopId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a shop with given id.', 500));
  }

  if (!shop) {
    return next(new HttpError('Could not find a shop for the provided id.', 404));
  }

  res.json({ shop });
};

const createShop = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, image, branch, city } = req.body;

  const createdShop = new Shops({
    name,
    image,
    branch,
    city
  });

  try {
    await createdShop.save();
  } catch (error) {
    return next(new HttpError('Creating shop failed', 500));
  }

  res.status(201).json({ shop: createdShop });
};

const updateShop = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, image, branch, city } = req.body;
  const shopId = req.params.sid;

  let shop;

  try {
    shop = await Shops.findById(shopId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find the shop with id', 500));
  }

  if (!shop) {
    return next(new HttpError('Could not find a shop for the provided id.', 404));
  }

  shop.name = name;
  shop.image = image;
  shop.branch = branch;
  shop.city = city;

  try {
    await shop.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update shop.', 500));
  }

  res.status(200).json({ shop });
};

const deleteShop = async (req, res, next) => {
  const shopId = req.params.sid;

  let shop;
  try {
    shop = await Shops.findById(shopId);
  } catch (error) {
    return next(new HttpError('Could not find a shop for the provided id.', 500));
  }

  if (!shop) {
    return next(new HttpError('Could not find a shop for the provided id.', 404));
  }

  let categories;
  try {
    categories = await Category.find({ shopId: shopId });
  } catch (error) {
    return next(new HttpError('Could not find categories for the provided shopId.', 500));
  }

  if (!categories) {
    return next(new HttpError('Could not find categories for the provided id.', 404));
  }

  let subcategories;
  try {
    subcategories = await SubCategory.find({ shopId: shopId });
  } catch(error) {
    return next(new HttpError('Could not find subcategories for the provided shopId.', 500));
  }

  if (!subcategories) {
    return next(new HttpError('Could not find subcategories for the provided id.', 404));
  }

  let products;
  try {
    products = await Products.find({ shopId: shopId });
  } catch(error) {
    return next(new HttpError('Could not find products for the provided shopId', 500));
  }

  if (!products) {
    return next(new HttpError('Could not find products for the provided id.', 404));
  }

  try {
    await Products.find({ shopId: shopId }).remove();
  } catch(error) {
    return next(new HttpError('Coult not delete products for the provided shopId', 500));
  }

  try {
    await SubCategory.find({ shopId: shopId }).remove();
  } catch(error) {
    return next(new HttpError('Could not delete subcategories for the provided shopId', 500));
  }

  try {
    await Category.find({ shopId: shopId }).remove();
  } catch(error) {
    return next(new HttpError('Could not delete categories for the provided shopId', 500));
  }

  try {
    await shop.remove();
  } catch (error) {
    return next(new HttpError('Could not delete a shop for the provided id.', 500));
  }
  res.status(200).json({ message: 'Deleted shop.' });
};

exports.getShops = getShops;
exports.getShopById = getShopById;
exports.createShop = createShop;
exports.updateShop = updateShop;
exports.deleteShop = deleteShop;