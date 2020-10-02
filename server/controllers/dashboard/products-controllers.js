const { validationResult } = require('express-validator');

const Products = require('../../models/products');
const SubCategory = require('../../models/subcategories');
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

const getProductsBySubcategoryId = async (req, res, next) =>{
	const subcategoryId = req.params.scid;
	let products;

	try {
		products = await Products.find({subcategoryId: subcategoryId});
	} catch (error) {
		return next(new HttpError('Reading products with given subcategory id failed.', 500));
	}

	if(!products){
		return next(new HttpError('Could not find products for the provided subcategory id.', 404));
	}

	res.status(200).json({ products });
}

const createProduct = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  
  const { name, description, amount, shopId, batchCode, image, subcategoryId, sgst, cgst } = req.body;

  let shop;

	try {
    shop = await Shops.findById(shopId);
	} catch (error) {
    return next(new HttpError('Something went wrong, could not find a shop with given id.', 500));
	}

	if(!shop){
    return next(new HttpError('Could not find a shop for the provided id.', 404));
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
    batchCode,
    image,
    subcategoryId,
    sgst,
    cgst,
  });

  try {
    await createdProduct.save();
  } catch (error) {
    return next(new HttpError('Creating product failed', 500));
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  let productId = req.params.pid;
  let product;
  const { name, description, amount, batchCode, image, sgst, cgst } = req.body;

  try {
    product = await Products.findById(productId);
  } catch (error) {
    return next(new HttpError('updating product failed', 500));
  }

  if (!product) {
    return next(new HttpError('Could not find a product for the provided id.', 404));
  }

  product.name = name;
  product.description = description;
  product.amount = amount;
  product.batchCode = batchCode;
  product.image = image;
  product.sgst = sgst;
  product.cgst = cgst;

  try {
    await product.save();
  } catch (error) {
    return next(new HttpError('updating product failed', 500));
  }

  res.status(200).json({ products: product});
};

const deleteProduct = async(req, res, next) => {
  const productId = req.params.pid;
  let product;
  try {
    product = await Products.findById(productId);
  } catch (error) {
    return next(new HttpError('Could not find a product for the provided id.', 500));
  }

  if (!product) {
    return next(new HttpError('Could not find a shop for the provided id.', 404));
  }

  try {
    await product.remove();
  } catch (error) {
    return next(new HttpError('Could not delete a product for the provided id.', 500));
  }
  res.status(200).json({ message: 'Deleted product.' });
};

const addProductPopular = async (req, res, next) => {
	const productId = req.params.pid;

	let product;

	try {
		product = await Products.findById(productId);
	} catch (error) {
		return next(new HttpError('Could not find a product for the provided id.', 500));
	}

	if (!product) {
		return next(new HttpError('Could not find a product for the provided id.', 404));
	}

	product.popular = true;

	try {
		await product.save();
	} catch (error) {
    console.log(error);
		return next(new HttpError('Toggling product to popular failed', 500));
	}

	res.status(200).json({ product });
}

const removeProductPopular = async (req, res, next) => {
	const productId = req.params.pid;

	let product;

	try {
		product = await Products.findById(productId);
	} catch (error) {
		return next(new HttpError('Could not find a product for the provided id.', 500));
	}

	if (!product) {
		return next(new HttpError('Could not find a product for the provided id.', 404));
	}

	product.popular = false;

	try {
		await product.save();
	} catch (error) {
    console.log(error);
		return next(new HttpError('Toggling product to popular failed', 500));
	}

	res.status(200).json({ product });
}

exports.getProducts = getProducts;
exports.getProductsById = getProductsById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductsBySubcategoryId = getProductsBySubcategoryId;
exports.addProductPopular = addProductPopular;
exports.removeProductPopular = removeProductPopular;