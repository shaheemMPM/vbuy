const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Orders = require('../../models/orders');
const Products = require('../../models/products');
const Sales = require('../../models/sales');

const getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await Orders.find().select('totalItems currentStatus netAmount timestamp').sort({timestamp: "desc"});
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find orders.', 500));
  }
  res.status(200).json({orders});
}

const getOrderById = async (req, res, next) => {
  const orderId = req.params.oid;

  let order;
  
  try {
    order = await Orders.findById(orderId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find order for given id.', 500));
  }

  if (!order) {
    return next(new HttpError('Could not find a order for the provided id.', 404));
  }

  res.status(200).json({order});
}

const getOrdersByStatus = async (req, res, next) => {
  const status = req.params.status;

  let orders;
  
  try {
    orders = await Orders.find({currentStatus: status}).select('totalItems currentStatus netAmount timestamp');
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find orders for given status.', 500));
  }

  res.status(200).json({orders});
}

const updateOrderStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  const orderId = req.params.oid;
  const { status } = req.body;

  let order;

  try {
    order = await Orders.findById(orderId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find order for given id.', 500));
  }

  if (!order) {
    return next(new HttpError('Could not find a order for the provided id.', 404));
  }

  order.currentStatus = status;

  try {
    await order.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update order.', 500));
  }

  res.status(200).json({ order });

}

const createSale = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { productId, selectedSize, quantity, orderId, userId, timestamp } = req.body;

  let product;

  try {
    product = await Products.findById(productId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find product for given id.', 500));
  }

  if (!product) {
    return next(new HttpError('Could not find a prodcut for the provided id.', 404));
  }

  let order;

  try {
    order = await Orders.findById(orderId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find order for given id.', 500));
  }

  if (!order) {
    return next(new HttpError('Could not find a order for the provided id.', 404));
  }

  let productIndex = order.productDetails.map(e => e.productId).indexOf(productId);

  order.productDetails[productIndex].paidOff = true;

  let shopId, amount, offerAmount;

  shopId = product.shopId;
  amount = (product.amount)*quantity;
  offerAmount = (product.offerPrice)*quantity;

  const createdSale = new Sales({
    productId,
    selectedSize,
    quantity,
    shopId,
    orderId,
    userId,
    amount,
    offerAmount,
    timestamp
  });

  try {
    await createdSale.save();
    await order.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError('Creating sale failed', 500));
  }

  res.status(201).json({ sale: createdSale });
}

exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.getOrdersByStatus = getOrdersByStatus;
exports.updateOrderStatus = updateOrderStatus;
exports.createSale = createSale;