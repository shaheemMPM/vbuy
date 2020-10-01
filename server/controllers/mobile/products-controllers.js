const HttpError = require('../../models/http-error');

const Products = require('../../models/products');

const getProductsBySubcategoryId = async (req, res, next) =>{
	const subcategoryId = req.params.scid;
	let products;

	try {
		products = await Products.find({subcategoryId: subcategoryId}).select('name image amount offer offerPrice');
	} catch (error) {
		return next(new HttpError('Reading products with given subcategory id failed.', 500));
	}

	if(!products){
		return next(new HttpError('Could not find products for the provided subcategory id.', 404));
	}

	res.status(200).json({ products });
}

const getProductsById = async(req, res, next) => {
	const productId = req.params.pid;
	let product;
  
	try {
	  product = await Products.findById(productId).select('-subcategoryId -offer -offerId');
	} catch (error) {
	  return next('Something went wrong, could not able to find product for given id.', 500);
	}
  
	if (!product) {
	  return next(new HttpError('Could not find a product for the provided id.', 404));
	}
	
	res.json({ product });
  };

exports.getProductsBySubcategoryId = getProductsBySubcategoryId;
exports.getProductsById = getProductsById;