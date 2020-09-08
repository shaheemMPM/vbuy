const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const Products = require('../models/products')

const HttpError = require('../models/http-error');

let DUMMY_PRODUCTS = [
  {
    categoryId: '001',
    name: 'prod1',
    description: 'desc',
    amount: 0,
    batchCode: 'p001',
    image: ["s.jpeg", "k.png"]
  }
];

const getProducts = async (req,res,next) =>{
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
      return next('Something went wrong', 500);
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
  
    const { categoryId, name, description, amount, batchCode, image} = req.body;
  
    const createdProduct = new Products({
      categoryId,
      name,
      description,
      amount,
      batchCode,
      image,
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
    const { categoryId, name, description, amount, batchCode, image} = req.body;

    try {
      product = await Products.findById(productId);
    } catch (error) {
      return next(new HttpError('updating product failed', 500));
    }


    if (!product) {
      return next(new HttpError('Could not find a product for the provided id.', 404));
    }

    product.categoryId = categoryId;
    product.name = name;
    product.description = description;
    product.amount = amount;
    product.batchCode = batchCode;
    product.image = image;

    try {
      await product.save();
    } catch (error) {
      return next(new HttpError('updating product failed', 500));
    }
  
    res.status(200).json({ products: product});
  };

const deleteProduct = (req, res, next) => {
    const productId = req.params.pid;

    Products.findByIdAndDelete(productId, (error, product)=>
    {
      if(error){
        return next(new HttpError('deleting product failed', 500));
      }
      else{
        res.status(200).json({ message: "Deleted product" });
      }
    }
  );
};

  exports.getProducts = getProducts;
  exports.getProductsById = getProductsById;
  exports.createProduct = createProduct;
  exports.updateProduct = updateProduct;
  exports.deleteProduct = deleteProduct;