const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const shopsRoutes = require('./routes/shops-routes');
const categoriesRoutes = require('./routes/categories-routes');
const subcategoriesRoutes = require('./routes/subcategories-routes.js');
const productsRoutes = require('./routes/products-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/shops', shopsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/subcategories', subcategoriesRoutes);
app.use('/api/v1/products', productsRoutes);

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
  .connect('mongodb+srv://nexero:subin123@cluster0.pd1yc.mongodb.net/vbuy?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.listen(5000, () => {
      console.log('Running on port 5000');
    });
  })
  .catch(err => {
    console.error(err);
  });