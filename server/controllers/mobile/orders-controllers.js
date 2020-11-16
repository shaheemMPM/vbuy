const { validationResult } = require('express-validator');

const Products = require('../../models/products'); //For product image
const HttpError = require('../../models/http-error');
const Orders = require('../../models/orders');

const getOrders = async (req, res, next) =>{
  let orders;
  let userId = req.userData.userId;

  try {
    orders = await Orders.find({userId : userId}).select('productDetails.productId productDetails.quantity currentStatus');
  } catch (error) {
    return next('Something went wrong', 500);
  }

  res.status(200).json({orders});
}

const getOrderById = async(req, res, next) => {
  const orderId = req.params.pid;
  let order;

  try {
    order = await Orders.findById(orderId);
  } catch (error) {
    return next('Something went wrong, could not able to find order for given id.', 500);
  }

  if (!order) {
    return next(new HttpError('Could not find a order for the provided id.', 404));
  }
  
  res.json({ order });
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

exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.createOrder = createOrder;