const { validationResult } = require('express-validator');

const Products = require('../../models/products');
const SubCategory = require('../../models/subcategories');
const Category = require('../../models/categories');
const Shops = require('../../models/shops');
const HttpError = require('../../models/http-error');
const Orders = require('../../models/orders');

const getProducts = async (req, res, next) =>{
  let products;
  try {
    products = await Products.find();
  } catch (error) {
    return next('Something went wrong', 500);
  }
  res.status(200).json({products});
}

const getProductsById = async(req, res, next) => {
  const productId = req.params.pid;
  let product;

  try {
    product = await Products.findById(productId);
  } catch (error) {
    return next('Something went wrong, could not able to find product for given id.', 500);
  }

  if (!product) {
    return next(new HttpError('Could not find a product for the provided id.', 404));
  }
  
  res.json({ product });
};

const createOrder = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  
  const { productDetails, address, modeOfPayment, discountPrice, totalSgst, totalCgst, netAmount} = req.body;

  let userId = req.userData.userId;

  const createdOrder = new Orders({
    productDetails,
    userId,
    address,
    modeOfPayment,
    discountPrice,
    totalSgst,
    totalCgst,
    netAmount
  });

  try {
    await createdOrder.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError('Creating order failed', 500));
  }

  res.status(201).json({ order: createdOrder });
};

exports.getProducts = getProducts;
exports.getProductsById = getProductsById;
exports.createOrder = createOrder;