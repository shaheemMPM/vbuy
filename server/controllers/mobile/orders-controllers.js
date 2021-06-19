const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Orders = require('../../models/orders');
const nodemailer = require("nodemailer");

const serviceKey = require('../../config/servicekey.json');

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
  
  res.json({ order: order });
}

const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  
  const { productDetails, address, modeOfPayment, discountPrice, totalSgst, totalCgst, netAmount, orderImage} = req.body;

  let userId = req.userData.userId;
  let userEmail = req.userData.email;

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

  sendMail(userEmail, netAmount);

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

async function sendMail(email, netAmount) {

  let mailContent = `
                      <p>
                        Your order with a net amount of ${netAmount}₹ has been placed. Thanks for purchasing with VBuy.
                      </p>
                    `
	
	const FROM_MAIL = 'info@vbuyeasypurchase.com';

    var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465, 
		secure: true,
        auth: {
			type: 'OAuth2',
			user: FROM_MAIL,
			serviceClient: serviceKey.client_id,
			privateKey: serviceKey.private_key
		},
	});
  
  let mailSubject = 'VBuy Purchase Invoice';
      
  var mailOptions = {
      from: FROM_MAIL,
      to: email,
      subject: mailSubject,
      html: mailContent        
	};
	
	try {
		await transporter.verify();
		let info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ' + info.response);
	} catch(err) {
		console.log(err);
	}
}

exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.createOrder = createOrder;
exports.cancelOrder = cancelOrder;