const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMY_CATEGORIES = [
  {
    id: 'c1',
  	name: 'category1',
  	image: 'link to image',
  	shopId: 's1'
  }
];

const getCategories = (req, res, next) => {
  res.status(200).json({categories: DUMMY_CATEGORIES});
}

const getCategoryById = (req, res, next) => {
	const categoryId = req.params.cid;

  const category = DUMMY_CATEGORIES.find(c => {
		return c.id === categoryId;
  });

  if (!category) {
  	return next(new HttpError('Could not find a category for the provided id.', 404));
  }

  res.json({ category });
}

const createCategory = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

	const { name, image, shopId } = req.body;

	const createdCategory = {
	  id: uuid(),
	  name,
	  image,
	  shopId
	};

	DUMMY_CATEGORIES.push(createdCategory);

	res.status(201).json({ category: createdCategory });
}

const updateCategory = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, image, shopId } = req.body;
	const categoryId = req.params.cid;

	const updatedCategory = { ...DUMMY_CATEGORIES.find(c => c.id == categoryId) };
	const categoryIndex = DUMMY_CATEGORIES.findIndex(c => c.id === categoryId);
	updatedCategory.name = name;
	updatedCategory.image = image;
	updatedCategory.shopId = shopId;

	DUMMY_CATEGORIES[categoryIndex] = updatedCategory;

	res.status(200).json({ category: updatedCategory });
}

const deleteCategory = (req, res, next) => {
	const categoryId = req.params.cid;
	if (!DUMMY_CATEGORIES.find(c => c.id === categoryId)) {
		return next(new HttpError('Could not find a category for that id.', 404));
	}
	DUMMY_CATEGORIES = DUMMY_CATEGORIES.filter(c => c.id !== categoryId);
	res.status(200).json({ message: 'Deleted Category.' });
}

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
