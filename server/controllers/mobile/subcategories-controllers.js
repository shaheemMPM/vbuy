const { validationResult } = require("express-validator");

const HttpError = require("../../models/http-error");
const SubCategory = require("../../models/subcategories");

const getSubcategoryByCategoryId = async (req, res, next) => {
  const categoryId = req.params.cid;
  let subcategories;

  try {
    subcategories = await SubCategory.find({ categoryId: categoryId });
  } catch (error) {
    return next(
      new HttpError("Reading subcategories with given category id failed.", 500)
    );
  }

  if (!subcategories) {
    return next(
      new HttpError(
        "Could not find subcategories for the provided category id.",
        404
      )
    );
  }

  res.status(200).json({ subcategories });
};

exports.getSubcategoryByCategoryId = getSubcategoryByCategoryId;
