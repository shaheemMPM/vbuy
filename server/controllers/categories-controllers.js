const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Category = require('../models/categories');

let DUMMY_CATEGORIES = [
  {
    id: 'c1',
  	name: 'category1',
  	image: 'link to image',
  	shopId: 's1'
  }
];

const getCategories = async (req, res, next) => {
	let categories;
	try {
		categories = await Category.find();
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	res.status(200).json(categories);
}

const getCategoryById = async (req, res, next) => {
	const categoryId = req.params.cid;
	let category;
	
	try {
		category = await Category.findById(categoryId);
	} catch(error) {
		return next(new HttpError('Reading categories failed', 500));
	}

  if (!category) {
  	return next(new HttpError('Could not find a category for the provided id.', 404));
  }

  res.json({ category });
}

const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

	const { name, image, shopId } = req.body;

	const createdCategory = new Category({
	  name,
	  image,
	  shopId
	});

	try {
		await createdCategory.save();
	} catch (error) {
		return next(new HttpError('Creating category failed', 500));
	}

	res.status(201).json({ category: createdCategory });
}

const updateCategory = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, image, shopId } = req.body;
	const categoryId = req.params.cid;

	let updatedCategory;

	try {
		updatedCategory = await Category.findById(categoryId);
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	updatedCategory.name = name;
	updatedCategory.image = image;
	updatedCategory.shopId = shopId;
	
	try {
		await updatedCategory.save();
	} catch (error) {
		return next(new HttpError('Updating categories failed', 500));
	}

	res.status(200).json({ updatedCategory });
}

const deleteCategory = (req, res, next) => {
	const categoryId = req.params.cid;

	Category.findByIdAndDelete(categoryId, (error, category) => {
		if (error) {
			return next(new HttpError('Deleting categories failed', 500));
		} else {
			console.log(category);
			res.status(200).json({ message: 'Deleted category.' });
		}
	});
}

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
