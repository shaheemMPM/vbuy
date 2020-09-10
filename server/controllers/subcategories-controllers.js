const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Subcategory = require('../models/subcategories');
const Category = require('../models/categories');

let DUMMY_CATEGORIES = [
  {
    id: 'sc1',
  	name: 'subcategory1',
  	image: 'link to image',
  	subcategoryId: 's1'
  }
];

const getSubCategories = async (req, res, next) => {
	let subcategories;
	try {
		subcategories = await Subcategory.find();
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

	res.status(200).json(subcategories);
}

const getSubCategoryById = async (req, res, next) => {
	const subcategoryId = req.params.scid;
	let subcategory;
	
	try {
		subcategory = await Subcategory.findById(subcategoryId);
	} catch(error) {
		return next(new HttpError('Reading subcategories failed', 500));
	}

  if (!subcategory) {
  	return next(new HttpError('Could not find a subcategory for the provided id.', 404));
  }

  res.json({ subcategory });
}

const createSubCategory = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

	const { name, image, categoryId, products} = req.body;
	let category;

	try {
			category = await Category.findById(categoryId);
	} catch (error) {
			return next(new HttpError('Something went wrong, could not find a category with given id.', 500));
	}

	if(!category){
			return next(new HttpError('Could not find a category for the provided id.', 404));
	}


	const createdSubcategory = new Subcategory({
			name,
			image,
			categoryId,
			products
	});

	category.subcategories.push(createdSubcategory.id);
	try {
			await createdSubcategory.save();
			await category.save();
	} catch (error) {
			console.log(error);
			return next(new HttpError('Creating subcategory failed', 500));
	}

	res.status(201).json({ subcategory: createdSubcategory });
}

const updateSubCategory = async (req, res, next) => {

    let category;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, image, categoryId } = req.body;
    category = await Category.findById(categoryId);
    if(!category){
        return next(new HttpError('Could not find a category for the provided id.', 404));
    }
	const subcategoryId = req.params.scid;

	let updatedSubCategory;

	try {
		updatedSubCategory = await Subcategory.findById(subcategoryId);
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}

    category.subcategories.push(createSubCategory.id);

	updatedSubCategory.name = name;
	updatedSubCategory.image = image;
	updatedSubCategory.categoryId = categoryIdId;
	
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
	let category;

	try {
		subcategory = await Subcategory.findById(subcategoryId);
	} catch (error) {
		return next(new HttpError('Reading categories failed', 500));
	}
	
	const categoryId = subcategory.categoryId;

	try{
			category = await Category.findById(categoryId);
	}catch(error){
			return next(new HttpError('Reading categories failed', 500));
	}

	Subcategory.findByIdAndDelete(subcategoryId, (error, subcategory) => {
		if (error) {
			return next(new HttpError('Deleting subcategory failed', 500));
		} else {
			res.status(200).json({ message: 'Deleted subcategory.' });
		}
	});
	
	category.subcategories.remove(subcategoryId);

	
}

exports.getSubCategories = getSubCategories;
exports.getSubCategoryById = getSubCategoryById;
exports.createSubCategory = createSubCategory;
exports.updateSubCategory = updateSubCategory;
exports.deleteSubCategory = deleteSubCategory;
