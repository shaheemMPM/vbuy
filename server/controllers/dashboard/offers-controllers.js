const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Offers = require('../../models/offers');
const Products = require('../../models/products');
const Shops = require('../../models/shops');

const getOffers = async (req, res, next) => {
	let offers;
	try {
		offers = await Offers.find();
	} catch (error) {
		return next(new HttpError('Reading offers failed', 500));
	}

	res.status(200).json({offers});
}

const getOffersByShopId = async (req, res, next) => {
	const shopId = req.params.sid;
	let offers;
	
	try {
		offers = await Offers.find({shopId: shopId});
	} catch(error) {
		return next(new HttpError('Reading offers failed', 500));
	}

	if (!offers) {
		return next(new HttpError('Could not find an offer for the provided shop id.', 404));
	}

	res.status(200).json({ offers });
}

const getOfferById = async (req, res, next) => {
	const offerId = req.params.oid;
	let offer;
	
	try {
		offer = await Offers.findById(offerId);
	} catch(error) {
		return next(new HttpError('Reading offers failed', 500));
	}

	if (!offer) {
		return next(new HttpError('Could not find an offer for the provided id.', 404));
	}

	res.status(200).json({ offer });
}

const createOffer = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, percentage, shopId, image } = req.body;

	let shop;

	try {
		shop = await Shops.findById(shopId);
	} catch (error) {
		return next(new HttpError('no shops were found on given shop id', 404));
	}
	
	const createdOffer = new Offers({
		name,
		percentage,
		shopId,
		image
	});

	try {
		await createdOffer.save();
	} catch (error) {
		return next(new HttpError('Creating offer failed', 500));
	}

	res.status(201).json({ offer: createdOffer });
}

const updateOffer = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, percentage, image } = req.body;
	const offerId = req.params.oid;

	let updatedOffer;

	try {
		updatedOffer = await Offers.findById(offerId);
	} catch (error) {
		return next(new HttpError('Reading offers failed', 500));
	}

	updatedOffer.name = name;
	updatedOffer.percentage = percentage;
	updatedOffer.image = image;
	
	try {
		await updatedOffer.save();
	} catch (error) {
		return next(new HttpError('Updating offer failed', 500));
	}

	res.status(200).json({ updatedOffer });
}

const deleteOffer = async (req, res, next) => {
	const offerId = req.params.oid;
	let offer;

	try {
		offer = await Offers.findById(offerId);
	} catch (error) {
		return next(new HttpError('Could not find an offer for the provided id.', 500));
	}

	if (!offer) {
		return next(new HttpError('Could not find an offer for the provided id.', 404));
	}

	let products;
	try {
		products = await Offers.findById(offerId).select('products');
	} catch (error) {
		return next(new HttpError('Could not find products for the provided id.', 500));
	}
	
	if(!products) {
		return next(new HttpError('Could not find any products associated with this offer', 404));
	}

	let productsList = products.products;

	productsList.forEach(async productId => {
		console.log(productId);

		let product;
		try {
			product = await Products.findById(productId);
		} catch (error) {
			return next(new HttpError('Could not find a product for the provided id.', 500));
		}

		if(!product) {
			return next(new HttpError('Could not find a product for the provided id', 404));
		}
		
		product.offerPrice = product.amount;
		product.offer = false;
		product.offerId = null;

		try {
			await product.save();
		} catch (error) {
			return next(new HttpError('Removing offer from a product failed', 500));
		}
	});

  	try {
		await offer.remove();
	} catch (error) {
		return next(new HttpError('Could not delete an offer for the provided id.', 500));
	}
	
	res.status(200).json({ message: 'Deleted offer.' });
}

const addProduct = async (req, res, next) => {
	const offerId = req.params.oid;
	const productId = req.params.pid;
	let offer;

	try {
		offer = await Offers.findById(offerId);
	} catch (error) {
		return next(new HttpError('Could not find an offer for the provided id.', 500));
	}

	if (!offer) {
		return next(new HttpError('Could not find an offer for the provided id.', 404));
	}

	let product;

	try {
		product = await Products.findById(productId);
	} catch (error) {
		return next(new HttpError('Could not find a product for the provided id.', 500));
	}

	if (!product) {
		return next(new HttpError('Could not find a product for the provided id.', 404));
	}

	offer.products.push(productId);
	product.offer = true;
	product.offerId = offerId;
	product.offerPrice = product.amount-((product.amount*offer.percentage)/100);

	try {
		await offer.save();
		await product.save();
	} catch (error) {
		return next(new HttpError('Adding product to the offer failed', 500));
	}

	res.status(200).json({ offer });
}

const removeProduct = async (req, res, next) => {
	const offerId = req.params.oid;
	const productId = req.params.pid;
	let offer;

	try {
		offer = await Offers.findById(offerId);
	} catch (error) {
		return next(new HttpError('Could not find an offer for the provided id.', 500));
	}

	if (!offer) {
		return next(new HttpError('Could not find an offer for the provided id.', 404));
	}

	const isInArray = offer.products.some(function (product) {
    	return product.equals(productId);
	});
	
	if (isInArray) {
		offer.products.remove(productId);
	} else {
		return next(new HttpError('Could not find a product for the provided id.', 404));
	}

	let product;

	try {
		product = await Products.findById(productId);
	} catch (error) {
		return next(new HttpError('Could not find a product for the provided id.', 404));
	}

	if (!product) {
		return next(new HttpError('Could not find a product for the provided id.', 404));
	}

	product.offerPrice = product.amount;
	product.offer = false;
	product.offerId = null;

	try {
		await offer.save();
	} catch (error) {
		return next(new HttpError('Removing product from the offer failed', 500));
	}

	res.status(200).json({ offer });
}



exports.getOffers = getOffers;
exports.getOffersByShopId = getOffersByShopId;
exports.getOfferById = getOfferById;
exports.createOffer = createOffer;
exports.updateOffer = updateOffer;
exports.deleteOffer = deleteOffer;
exports.addProduct = addProduct;
exports.removeProduct = removeProduct;
