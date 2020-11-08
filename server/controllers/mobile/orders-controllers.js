const { validationResult } = require('express-validator');

const Products = require('../../models/products');
const SubCategory = require('../../models/subcategories');
const Category = require('../../models/categories');
const Shops = require('../../models/shops');
const HttpError = require('../../models/http-error');

const getProducts = async (req, res, next) =>{
  let products;
  try {
    products = await Products.find();
  } catch (error) {
    return next('Something went wrong', 500);
  }
  res.status(200).json({products});
}

const getProductsById = async(req, res, next) => {
  const productId = req.params.pid;
  let product;

  try {
    product = await Products.findById(productId);
  } catch (error) {
    return next('Something went wrong, could not able to find product for given id.', 500);
  }

  if (!product) {
    return next(new HttpError('Could not find a product for the provided id.', 404));
  }
  
  res.json({ product });
};

const createProduct = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  
  const { name, description, amount, shopId, categoryId, subcategoryId, batchCode, image, sgst, cgst } = req.body;

  let shop;

	try {
    shop = await Shops.findById(shopId);
	} catch (error) {
    return next(new HttpError('Something went wrong, could not find a shop with given id.', 500));
	}

	if(!shop){
    return next(new HttpError('Could not find a shop for the provided id.', 404));
  }

  let category;

	try {
    category = await Category.findById(categoryId);
	} catch (error) {
    return next(new HttpError('Something went wrong, could not find a category with given id.', 500));
	}

	if(!category){
    return next(new HttpError('Could not find a category for the provided id.', 404));
  }
  
  let subcategory;

	try {
    subcategory = await SubCategory.findById(subcategoryId);
	} catch (error) {
    return next(new HttpError('Something went wrong, could not find a category with given id.', 500));
	}

	if(!subcategory){
    return next(new HttpError('Could not find a subcategory for the provided id.', 404));
	}
  
  const createdProduct = new Products({
    name,
    description,
    amount,
    shopId,
    categoryId,
    subcategoryId,
    batchCode,
    image,
    sgst,
    cgst,
    offerPrice: amount
  });

  try {
    await createdProduct.save();
  } catch (error) {
    return next(new HttpError('Creating product failed', 500));
  }

  res.status(201).json({ product: createdProduct });
};

exports.getProducts = getProducts;
exports.getProductsById = getProductsById;
exports.createProduct = createProduct;