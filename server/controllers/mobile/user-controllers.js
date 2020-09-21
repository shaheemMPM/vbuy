const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const Admin = require('../models/admin');

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}
  
	const { name, email, password } = req.body;
  
	let existingAdmin;
	try {
		existingAdmin = await Admin.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.', 500);
		return next(error);
	}
  
	if (existingAdmin) {
		const error = new HttpError('Admin exists already, please login instead.', 422);
		return next(error);
	}
  
	let hashedPassword;
	try {
	  	hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError('Could not create admin, please try again.', 500);
		return next(error);
	}
  
	const createdAdmin = new Admin({
		name,
		email,
		password: hashedPassword
	});
  
	try {
		await createdAdmin.save();
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.', 500);
		return next(error);
	}
  
	let token;
	try {
		token = jwt.sign({
			adminId: createdAdmin.id,
			email: createdAdmin.email
		}, 'nexero_super_boys_supersecret_key', { expiresIn: '1h' });
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.', 500);
		return next(error);
	}
  
	res.status(201).json({ 
		adminId: createdAdmin.id, 
		email: createdAdmin.email, 
		token: token 
	});
}
  
const login = async (req, res, next) => {
	const { email, password } = req.body;
  
	let existingAdmin;
  
	try {
	  	existingAdmin = await Admin.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Logging in failed, please try again later.', 500);
		return next(error);
	}
  
	if (!existingAdmin) {
		const error = new HttpError('Invalid credentials, could not log you in.', 403);
		return next(error);
	}
  
	let isValidPassword = false;
	try {
	  	isValidPassword = await bcrypt.compare(password, existingAdmin.password);
	} catch (err) {
		const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
		return next(error);
	}
  
	if (!isValidPassword) {
		const error = new HttpError('Invalid credentials, could not log you in.', 403);
		return next(error);
	}
  
	let token;
	try {
		token = jwt.sign({
			adminId: existingAdmin.id,
			email: existingAdmin.email
		}, 'nexero_super_boys_supersecret_key', { expiresIn: '1h' });
	} catch (err) {
		const error = new HttpError('Logging in failed, please try again later.', 500);
		return next(error);
	}
  
	res.status(200).json({
		adminId: existingAdmin.id,
		email: existingAdmin.email,
		token: token
	});
}
  
exports.signup = signup;
exports.login = login;