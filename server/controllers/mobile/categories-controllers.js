const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Categories = require('../../models/categories');
const Shops = require('../../models/shops');

const getCategoriesByShopId = async (req, res, next) =>{
	const shopId = req.params.sid;
	let categories;

	try {
		categories = await Categories.find({shopId: shopId});
	} catch (error) {
		return next(new HttpError('Reading categories with given shop id failed.', 500));
	}

	if(!categories){
		return next(new HttpError('Could not find a categories for the provided shop id.', 404));
	}

	res.status(200).json({ categories });
}

exports.getCategoriesByShopId = getCategoriesByShopId;