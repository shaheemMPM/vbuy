const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Orders = require('../../models/orders');
const Products = require('../../models/products');

const getOrders = async (req, res, next) =>{
  let orders;
  let userId = req.userData.userId;

  try {
    orders = await Orders.find({userId : userId}).select('totalItems currentStatus orderImage timestamp').sort({timestamp: "desc"});
  } catch (error) {
    return next('Something went wrong', 500);
  }

  if (!orders) {
    return next(new HttpError('Could not find a order for the provided user.', 404));
  }

  res.status(200).json({orders});
}

const getOrderById = async(req, res, next) => {
  const orderId = req.params.oid;
  let order;

  try {
    order = await Orders.findById(orderId);
  } catch (error) {
    return next('Something went wrong, could not able to find order for given id.', 500);
  }

  if (!order) {
    return next(new HttpError('Could not find a order for the provided id.', 404));
  }

  let productDetails = order.productDetails;
  let productIds = productDetails.map(prod => {return prod.productId});

  let productNames;

  try {
    productNames = await Products.find({'_id': {$in: productIds}}).select('name');
  } catch (error) {
    return next('Something went wrong, could not able to find product names for given ids.', 500);
  }

  if (!productNames) {
    return next(new HttpError('Could not find a product names for the provided ids.', 404));
  }

  let newOrder = {...order._doc, productNames: productNames};
  
  res.json({ order: newOrder });
}

const createOrder = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  
  const { productDetails, address, modeOfPayment, discountPrice, totalSgst, totalCgst, netAmount, orderImage} = req.body;

  let userId = req.userData.userId;

  const createdOrder = new Orders({
    productDetails,
    userId,
    address,
    modeOfPayment,
    discountPrice,
    totalSgst,
    totalCgst,
    netAmount,
    orderImage,
    totalItems: productDetails.length,
    timestamp: Number(new Date())
  });

  try {
    await createdOrder.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError('Creating order failed', 500));
  }

  res.status(201).json({ order: createdOrder });
}

const cancelOrder = async (req, res, next) => {
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

  order.currentStatus = "UCANCEL";

  try {
    await order.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update order.', 500));
  }

  res.status(200).json({ order });

}

exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.createOrder = createOrder;
exports.cancelOrder = cancelOrder;