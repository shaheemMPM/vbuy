const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Shop = require('../models/shops');

let DUMMY_SHOPS = [
  {
    id: 's1',
    name: 'shop1',
    image: 'link to image',
    branch: 'branch name',
    categories: []
  }
];

const getShops = (req, res, next) => {
  res.status(200).json({shops: DUMMY_SHOPS});
}

const getShopById = (req, res, next) => {
  const shopId = req.params.sid;

  const shop = DUMMY_SHOPS.find(s => {
    return s.id === shopId;
  });

  if (!shop) {
    return next(new HttpError('Could not find a shop for the provided id.', 404));
  }

  res.json({ shop }); // => { shop } => { shop: shop }
};

const createShop = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, image, branch } = req.body;

  const createdShop = new Shop({
    name,
    image,
    branch
  });

  try {
    await createdShop.save();
  } catch (error) {
    return next(new HttpError('Creating shop failed', 500));
  }

  res.status(201).json({ shop: createdShop });
};

const updateShop = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, image, branch } = req.body;
  const shopId = req.params.sid;

  const updatedShop = { ...DUMMY_SHOPS.find(s => s.id === shopId) };
  const shopIndex = DUMMY_SHOPS.findIndex(s => s.id === shopId);
  updatedShop.name = name;
  updatedShop.image = image;
  updatedShop.branch = branch;

  DUMMY_SHOPS[shopIndex] = updatedShop;

  res.status(200).json({ shop: updatedShop });
};

const deleteShop = (req, res, next) => {
  const shopId = req.params.sid;
  if (!DUMMY_SHOPS.find(s => s.id === shopId)) {
    return next(new HttpError('Could not find a shop for that id.', 404));
  }
  DUMMY_SHOPS = DUMMY_SHOPS.filter(s => s.id !== shopId);
  res.status(200).json({ message: 'Deleted shop.' });
};

exports.getShops = getShops;
exports.getShopById = getShopById;
exports.createShop = createShop;
exports.updateShop = updateShop;
exports.deleteShop = deleteShop;
