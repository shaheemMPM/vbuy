const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const SubCategory = require('../models/subcategories');
const Category = require('../models/categories');

const getSubCategories = async (req, res, next) => {
	let subcategories;
	try {
		subcategories = await SubCategory.find();
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	res.status(200).json({subcategories});
}

const getSubCategoryById = async (req, res, next) => {
	const subcategoryId = req.params.scid;
	let subcategory;
	
	try {
		subcategory = await SubCategory.findById(subcategoryId);
	} catch(error) {
		return next(new HttpError('Reading subcategories failed', 500));
	}

	if (!subcategory) {
		return next(new HttpError('Could not find a subcategory for the provided id.', 404));
	}

	res.status(200).json({ subcategory });
}

const getSubcategoryByCategoryId = async (req, res, next) =>{
	const categoryId = req.params.cid;
	let subcategories;

	try {
		subcategories = await SubCategory.find({categoryId: categoryId});
	} catch (error) {
		return next(new HttpError('Reading subcategories with given category id failed.', 500));
	}

	if(!subcategories){
		return next(new HttpError('Could not find subcategories for the provided category id.', 404));
	}

	res.status(200).json({ subcategories });
}

const createSubCategory = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, image, categoryId} = req.body;

	let category;
	try {
		category = await Category.findById(categoryId);
	} catch (error) {
		return next(new HttpError('Something went wrong, could not find a category with given id.', 500));
	}

	if(!category){
		return next(new HttpError('Could not find a category for the provided id.', 404));
	}

	const createdSubCategory = new SubCategory({
		name,
		image,
		categoryId
	});

	try {
		await createdSubCategory.save();
	} catch (error) {
		return next(new HttpError('Creating subcategory failed', 500));
	}

	res.status(201).json({ subcategory: createdSubCategory });
}

const updateSubCategory = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, image } = req.body;

	const subcategoryId = req.params.scid;

	let updatedSubCategory;
	try {
		updatedSubCategory = await SubCategory.findById(subcategoryId);
	} catch (error) {
		return next(new HttpError('Reading sub categories failed', 500));
	}

	if(!updatedSubCategory){
		return next(new HttpError('Could not find a sub category for the provided id.', 404));
	}

	updatedSubCategory.name = name;
	updatedSubCategory.image = image;
	
	try {
		await updatedSubCategory.save();
	} catch (error) {
		return next(new HttpError('Updating subcategories failed', 500));
	}

	res.status(200).json({ updatedSubCategory });
}

const deleteSubCategory = async (req, res, next) => {
	const subcategoryId = req.params.scid;
	let subcategory;

	try {
		subcategory = await SubCategory.findById(subcategoryId);
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	if (!subcategory) {
		return next(new HttpError('Could not find a sub category for the provided id', 404));
	}

	try {
		await subcategory.remove();
	} catch (error) {
		return next(new HttpError('Could not delete a sub category for the provided id.', 500));
	}

	res.status(200).json({ message: 'Deleted subcategory.' });
}

exports.getSubCategories = getSubCategories;
exports.getSubCategoryById = getSubCategoryById;
exports.createSubCategory = createSubCategory;
exports.updateSubCategory = updateSubCategory;
exports.deleteSubCategory = deleteSubCategory;
exports.getSubcategoryByCategoryId = getSubcategoryByCategoryId;