const express = require('express');
const { check } = require('express-validator');

const categoriesController = require('../controllers/categories-controllers');

const router = express.Router();

router.get('/', categoriesController.getCategories);

router.get('/:cid', categoriesController.getCategoryById);

router.post(
  '/',
	[
		check('name').not().isEmpty(),
    check('image').not().isEmpty(),
    check('shopId').not().isEmpty()
  ],
  categoriesController.createCategory
);

router.patch(
  '/:cid',
  [
    check('name').not().isEmpty(),
    check('image').not().isEmpty()
  ],
  categoriesController.updateCategory
);

router.delete('/:cid', categoriesController.deleteCategory);

module.exports = router;
