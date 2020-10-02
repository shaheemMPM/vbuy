// Importing Core Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Importing dashboard routes
const shopsRoutes = require('./routes/dashboard/shops-routes');
const categoriesRoutes = require('./routes/dashboard/categories-routes');
const subcategoriesRoutes = require('./routes/dashboard/subcategories-routes.js');
const productsRoutes = require('./routes/dashboard/products-routes');
const offersRoutes = require('./routes/dashboard/offers-routes');
const adminRoutes = require('./routes/dashboard/admin-routes');

// Importing mobile routes
const userRoutes = require('./routes/mobile/user-routes');
const mobCategoriesRoutes = require('./routes/mobile/categories-routes');
const mobSubcategoriesRoutes = require('./routes/mobile/subcategories-routes');
const mobShopRoutes = require('./routes/mobile/shop-routes');
const mobOfferRoutes = require('./routes/mobile/offers-routes');
const mobProductsRoutes = require('./routes/mobile/products-routes');

// Importing general models
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

// dashboard route initializing
app.use('/api/dashboard/v1/shops', shopsRoutes);
app.use('/api/dashboard/v1/categories', categoriesRoutes);
app.use('/api/dashboard/v1/subcategories', subcategoriesRoutes);
app.use('/api/dashboard/v1/products', productsRoutes);
app.use('/api/dashboard/v1/offers', offersRoutes);
app.use('/api/dashboard/v1/admin', adminRoutes);
// mobile route initializing
app.use('/api/mobile/v1/user', userRoutes);
app.use('/api/mobile/v1/categories', mobCategoriesRoutes);
app.use('/api/mobile/v1/subcategories', mobSubcategoriesRoutes);
app.use('/api/mobile/v1/shops', mobShopRoutes);
app.use('/api/mobile/v1/offers', mobOfferRoutes);
app.use('/api/mobile/v1/products', mobProductsRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
  .connect('mongodb+srv://nexero:subin123@cluster0.pd1yc.mongodb.net/vbuy?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Running on port 5000');
    });
  })
  .catch(err => {
    console.error(err);
  });