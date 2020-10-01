const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Offers = require('../../models/offers');

const getOffers = async (req, res, next) =>{
	let offers;

	try {
		offers = await Offers.find().select('name image percentage');
	} catch (error) {
		return next(new HttpError('Reading offers failed.', 500));
	}

	res.status(200).json({ offers });
}

exports.getOffers = getOffers;