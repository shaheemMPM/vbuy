const HttpError = require('../../models/http-error');
const Users = require('../../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await Users.find().select('-password -__v');
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find users.', 500));
  }
  res.status(200).json({users});
}

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;

  try {
    user = await Users.findById(userId).select('-password -__v');
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a shop with given id.', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find a user for the provided id.', 404));
  }

  res.json({ user });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;