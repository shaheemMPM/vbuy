const express = require("express");
const { check } = require("express-validator");

const categoriesController = require("../../controllers/dashboard/categories-controllers");
const checkAuth = require("../../middlewares/check-isadmin");

const router = express.Router();

router.use(checkAuth);

router.get("/", categoriesController.getCategories);

router.get("/:cid", categoriesController.getCategoryById);
router.get("/shop/:sid", categoriesController.getCategoriesByShopId);

router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("image").not().isEmpty(),
    check("shopId").not().isEmpty(),
  ],
  categoriesController.createCategory
);

router.patch(
  "/:cid",
  [check("name").not().isEmpty(), check("image").not().isEmpty()],
  categoriesController.updateCategory
);

router.delete("/:cid", categoriesController.deleteCategory);

module.exports = router;
