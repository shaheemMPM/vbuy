const { validationResult } = require('express-validator');

const HttpError = require('../../models/http-error');
const Categories = require('../../models/categories');
const Shops = require('../../models/shops');
const SubCategory = require('../../models/subcategories');
const Products = require('../../models/products');

const getCategories = async (req, res, next) => {
	let categories;
	try {
		categories = await Categories.find();
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	res.status(200).json({categories});
}

const getCategoryById = async (req, res, next) => {
	const categoryId = req.params.cid;
	let category;
	
	try {
		category = await Categories.findById(categoryId);
	} catch(error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	if (!category) {
		return next(new HttpError('Could not find a category for the provided id.', 404));
	}

	res.status(200).json({ category });
}

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

const createCategory = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, image, shopId } = req.body;

	let shop;

	try {
		shop = await Shops.findById(shopId);
	} catch (error) {
		return next(new HttpError('Something went wrong, could not find a shop with given id.', 500));
	}

	if (!shop) {
		return next(new HttpError('Could not find a shop for the provided id.', 404));
	}
	
	const createdCategory = new Categories({
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

	const { name, image } = req.body;
	const categoryId = req.params.cid;

	let updatedCategory;

	try {
		updatedCategory = await Categories.findById(categoryId);
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	updatedCategory.name = name;
	updatedCategory.image = image;
	
	try {
		await updatedCategory.save();
	} catch (error) {
		return next(new HttpError('Updating categories failed', 500));
	}

	res.status(200).json({ updatedCategory });
}

const deleteCategory = async (req, res, next) => {
	const categoryId = req.params.cid;

	let category;
	try {
		category = await Categories.findById(categoryId);
	} catch (error) {
		return next(new HttpError('Could not find a category for the provided id.', 500));
	}

	if (!category) {
		return next(new HttpError('Could not find a category for the provided id.', 404));
	}

	let subcategories;
	try {
		subcategories = await SubCategory.find({ categoryId: categoryId });
	} catch(error) {
		return next(new HttpError('Could not find subcategories for the provided categoryId', 500));
	}

	if(!subcategories) {
		return next(new HttpError('Could not find a subcategories for the provided categoryId', 404));
	}

	let products;
  	try {
    	products = await Products.find({ categoryId: categoryId });
  	} catch(error) {
    	return next(new HttpError('Could not find products for the provided categoryId', 500));
  	}

  	if (!products) {
    	return next(new HttpError('Could not find products for the provided categoryId.', 404));
	}

	try {
		await Products.find({ categoryId: categoryId }).remove();
	} catch(error) {
		return next(new HttpError('Coult not delete products for the provided categoryId', 500));
	}
	
	try {
		await SubCategory.find({ categoryId: categoryId }).remove();
	} catch(error) {
		return next(new HttpError('Could not delete subcategories for the provided categoryId', 500));
	}

	try {
		await category.remove();
	} catch (error) {
		return next(new HttpError('Could not delete a category for the provided id.', 500));
	}

	res.status(200).json({ message: 'Deleted category.' });
}

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCategoriesByShopId = getCategoriesByShopId;