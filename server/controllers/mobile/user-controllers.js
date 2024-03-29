const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const password_generator = require("generate-password");

const HttpError = require("../../models/http-error");
const User = require("../../models/user");

const serviceKey = require("../../config/servicekey.json");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { name, email, mobile, place } = req.body;

  email = email.toLowerCase();

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let password = password_generator.generate({
    length: 8,
    numbers: true,
  });

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  if (mobile) {
    if (mobile.length !== 10) {
      return next(new HttpError("Mobile number should be 10 digit.", 422));
    }
  } else {
    mobile = "";
  }

  const createdUser = new User({
    name,
    email,
    mobile,
    place,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  sendMail(name, email, password, false);

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      "nexero_super_boys_supersecret_key"
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
    mobile: createdUser.mobile,
    token: token,
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { email, password } = req.body;

  email = email.toLowerCase();

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      "nexero_super_boys_supersecret_key"
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    mobile: existingUser.mobile,
    token: token,
  });
};

const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { email } = req.body;

  email = email.toLowerCase();

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Checking users failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find an account linked with the given mail.",
      404
    );
    return next(error);
  }

  let password = password_generator.generate({
    length: 15,
    numbers: true,
  });

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not reset password, please try again.",
      500
    );
    return next(error);
  }

  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    return next(new HttpError("Updating user failed", 500));
  }

  sendMail(user.name, email, password, true);
  res.status(200).json({ message: "Password sent to the mail address" });
};

const changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { email, password, newPassword } = req.body;

  email = email.toLowerCase();

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find an account with the given email.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    return next(
      new HttpError("Changing password failed, please try again later.", 500)
    );
  }

  res.status(200).json({ message: "Successfully changed the password" });
};

async function sendMail(name, email, password, forgot) {
  const FROM_MAIL = "info@vbuyeasypurchase.com";

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: FROM_MAIL,
      serviceClient: serviceKey.client_id,
      privateKey: serviceKey.private_key,
    },
  });

  let mailText, mailSubject;
  if (forgot) {
    mailSubject = "VBuy account password reset";
    mailText = `Hi ${name}, \nHere is your new password for your VBuy account.
		Thank you for using VBuy and Happy Purchasing!!
		\n\nPassword: ${password}`;
  } else {
    mailSubject = "VBuy Login credentials";
    mailText = `Hi ${name}, \nHere is your password for your new VBuy account.
		Thank you for using VBuy and Happy Purchasing!!
		\n\nPassword: ${password}`;
  }

  var mailOptions = {
    from: FROM_MAIL,
    to: email,
    subject: mailSubject,
    text: mailText,
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
  };

  try {
    await transporter.verify();
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.log(err);
  }
}

exports.signup = signup;
exports.login = login;
exports.resetPassword = resetPassword;
exports.changePassword = changePassword;
