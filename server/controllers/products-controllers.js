const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMY_PRODUCTS = [
  {
    id: 's1',
    categoryId: '001',
    name: 'prod1',
    description: 'desc',
    amount: 0,
    batchCode: 'p001',
    image: ["s.jpeg", "k.png"]
  }
];

const getProducts = (req,res,next) =>{
    res.status(200).json({products: DUMMY_PRODUCTS});
}

const getProductsById = (req, res, next) => {
    const productId = req.params.pid;
  
    const product = DUMMY_PRODUCTS.find(s => {
      return s.id === productId;
    });
  
    if (!product) {
      return next(new HttpError('Could not find a product for the provided id.', 404));
    }
  
    res.json({ product });
  };

const createProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
  
    const { categoryId, name, description, amount, batchCode, image} = req.body;
  
    const createdProduct = {
      id: uuid(),
      categoryId,
      name,
      description,
      amount,
      batchCode,
      image,
    };
  
    DUMMY_PRODUCTS.push(createdProduct);
  
    res.status(201).json({ product: createdProduct });
  };

const updateProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
  
    const { categoryId, name, description, amount, batchCode, image} = req.body;
    const productId = req.params.pid;
  
    const updatedProduct = { ...DUMMY_PRODUCTS.find(s => s.id === productId) };
    const productIndex = DUMMY_PRODUCTS.findIndex(s => s.id === productId);
    updatedProduct.categoryId = categoryId;
    updatedProduct.name = name;
    updatedProduct.description = description;
    updatedProduct.amount = amount;
    updatedProduct.batchCode = batchCode;
    updatedProduct.image = image;
  
    DUMMY_PRODUCTS[productIndex] = updatedProduct
  
    res.status(200).json({ product: updatedProduct });
  };

const deleteProduct = (req, res, next) => {
    const productId = req.params.pid;
    if (!DUMMY_PRODUCTS.find(s => s.id === productId)) {
      return next(new HttpError('Could not find a shop for that id.', 404));
    }
    DUMMY_PRODUCTS = DUMMY_PRODUCTS.filter(s => s.id !== productId);
    res.status(200).json({ message: 'Deleted product.' });
  };

  exports.getProducts = getProducts;
  exports.getProductsById = getProductsById;
  exports.createProduct = createProduct;
  exports.updateProduct = updateProduct;
  exports.deleteProduct = deleteProduct;