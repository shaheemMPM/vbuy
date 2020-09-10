const express = require('express');
const { check } = require('express-validator');

const subcategoriesController = require('../controllers/subcategories-controllers');

const router = express.Router();

router.get('/', subcategoriesController.getSubCategories);

router.get('/:scid', subcategoriesController.getSubCategoryById);

router.post(
  '/',
	[
		check('name').not().isEmpty(),
    check('image').not().isEmpty(),
    check('categoryId').not().isEmpty()
  ],
  subcategoriesController.createSubCategory
);

router.patch(
  '/:scid',
  [
    check('name').not().isEmpty(),
    check('image').not().isEmpty()
  ],
  subcategoriesController.updateSubCategory
);

router.delete('/:scid', subcategoriesController.deleteSubCategory);

module.exports = router;