const HttpError = require("../../models/http-error");
const Users = require("../../models/user");
const Orders = require("../../models/orders");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await Users.find().select("-password -__v");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find users.", 500)
    );
  }
  res.status(200).json({ users });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user, orders;

  try {
    user = await Users.findById(userId).select("-password -__v");
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong, could not find a user with given id.",
        500
      )
    );
  }

  try {
    orders = await Orders.find({ userId: userId });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong, could not find a orders for given user",
        500
      )
    );
  }

  if (!user) {
    return next(
      new HttpError("Could not find a user for the provided id.", 404)
    );
  }

  res.json({
    user: {
      name: user.name,
      _id: user._id,
      mobile: user.mobile,
      email: user.email,
      place: user.place,
      orders: orders,
      timestamp: user._id.getTimestamp(),
    },
  });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
