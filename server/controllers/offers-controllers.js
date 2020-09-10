const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Offers = require('../models/offers');

const getOffers = async (req, res, next) => {
	let offers;
	try {
		offers = await Offers.find();
	} catch (error) {
		return next(new HttpError('Reading offers failed', 500));
	}

	res.status(200).json(offers);
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

  	res.json({ offer });
}

const createOffer = async (req, res, next) => {
  	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, percentage } = req.body;
	
	const createdOffer = new Offers({
		name,
		percentage
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

	const { name, percentage } = req.body;
	const offerId = req.params.oid;

	let updatedOffer;

	try {
		updatedOffer = await Offers.findById(offerId);
	} catch (error) {
		return next(new HttpError('Reading offers failed', 500));
	}

	updatedOffer.name = name;
	updatedOffer.percentage = percentage;
	
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

  	try {
		await offer.remove();
	} catch (error) {
		return next(new HttpError('Could not delete an offer for the provided id.', 500));
	}
	
  	res.status(200).json({ message: 'Deleted offer.' });
}

exports.getOffers = getOffers;
exports.getOfferById = getOfferById;
exports.createOffer = createOffer;
exports.updateOffer = updateOffer;
exports.deleteOffer = deleteOffer;
