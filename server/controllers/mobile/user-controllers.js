const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const password_generator = require('generate-password');

const HttpError = require('../../models/http-error');
const User = require('../../models/user');

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}
  
	let { name, email, mobile } = req.body;

	email = email.toLowerCase();
  
	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.', 500);
		return next(error);
	}
  
	if (existingUser) {
		const error = new HttpError('User exists already, please login instead.', 422);
		return next(error);
	}

	let password = password_generator.generate({
		length: 15,
		numbers: true
	});
  
	let hashedPassword;
	try {
	  	hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError('Could not create user, please try again.', 500);
		return next(error);
	}

	if (mobile) {
		if (mobile.length !== 10) {
			return next(new HttpError('Mobile number should be 10 digit.', 422));
		}
	} else {
		mobile = '';
	}

	const createdUser = new User({
		name,
		email,
		mobile,
		password: hashedPassword
	});
  
	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.', 500);
		return next(error);
	}

	sendMail(name, email, password);
  
	let token;
	try {
		token = jwt.sign({
			userId: createdUser.id,
			email: createdUser.email
		}, 'nexero_super_boys_supersecret_key');
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.', 500);
		return next(error);
	}
  
	res.status(201).json({ 
		userId: createdUser.id, 
		email: createdUser.email, 
		name: createdUser.name,
		mobile: createdUser.mobile,
		token: token 
	});
}
  
const login = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}
	
	let { email, password } = req.body;

	email = email.toLowerCase();
  
	let existingUser;
  
	try {
	  	existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Logging in failed, please try again later.', 500);
		return next(error);
	}
  
	if (!existingUser) {
		const error = new HttpError('Invalid credentials, could not log you in.', 403);
		return next(error);
	}
  
	let isValidPassword = false;
	try {
	  	isValidPassword = await bcrypt.compare(password, existingUser.password);
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
			userId: existingUser.id,
			email: existingUser.email
		}, 'nexero_super_boys_supersecret_key');
	} catch (err) {
		const error = new HttpError('Logging in failed, please try again later.', 500);
		return next(error);
	}
  
	res.status(200).json({
		userId: existingUser.id,
		email: existingUser.email,
		name: existingUser.name,
		mobile: existingUser.mobile,
		token: token
	});
}

async function sendMail(name, email, password) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nexerotech@gmail.com',
            pass: '3000Shits!'
        }
    });
      
    var mailOptions = {
        from: 'nexerotech@gmail.com',
        to: email,
        subject: 'VBuy Login credentials',
        text: `Hi ${name}, \nHere is your password for your new VBuy account.
				Thank you for using VBuy and Happy Purchasing!!
				\n\nPassword: ${password}`
        // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
	};
	
	try {
		let info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ' + info.response);
	} catch(err) {
		console.log(err);
	}
}

exports.signup = signup;
exports.login = login;