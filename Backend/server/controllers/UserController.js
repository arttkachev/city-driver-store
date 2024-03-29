// controller handles requests/responds

import express from 'express';
import UserService from "../services/UserService";
const bcrypt = require('bcryptjs'); // hashing passwords
const jwt = require('jsonwebtoken'); // user auth

// expose our model and functionality to talk to db through UserService
let _userService = new UserService().repository;

export default class UserController {
	constructor() {
		this.router = express.Router()
			.get('', this.getUsers)
			.get('/:id/user', this.getUserById)
			.get('/get/count', this.getUserCount)
			.post('/register', this.registerUser)
			.post('/login', this.login)
			.put('/:id', this.editUser)
			.delete('/:id', this.deleteUser)
	}

	async getUsers(req, res, next) {
		try {
			let user = await _userService.find({}).select('-passwordHash');
			return res.send(user);
		}
		catch (error) {
			next(error);
		}
	}

	async getUserById(req, res, next) {
		try {
			let userById = await _userService.findById(req.params.id).select('-passwordHash');;
			return res.send(userById);
		}
		catch (error) {
			next(error);
		}
	}

	async registerUser(req, res, next) {
		try {
			let newUser = await _userService.create({
				name: req.body.name,
				email: req.body.email,
				password: bcrypt.hashSync(req.body.password), // hashing password
				isAdmin: req.body.isAdmin,
				balance: req.body.balance,
				purchased: req.body.purchased
			});
			return res.send(newUser);
		}
		catch (error) {
			next(error);
		}
	}

	async login(req, res) {
		// first, let's check if a user exists. Looking for the user by email
		const user = await _userService.findOne({
			email: req.body.email
		});

		if (user) {
			// if password correct, create a token for the user with the jwt lib
			if (bcrypt.compareSync(req.body.password, user.password)) {
				const secret = process.env.SECRET;
				// a token is used by a client to access the API
				const token = jwt.sign(
					{
						userId: user.id, // you can pass anything
						isAdmin: user.isAdmin // additional secret information sticked to a token
					},
					secret, // secret is something like a password to create a token. It's being used to secure server's API
					{ expiresIn: '1d' } // optional. Token expires in 1d and the used will be logged out
				)
				return res.status(200).send({ user: user.email, token: token });
			}
			else {
				return res.status(400).send('wrong password');
			}
		}
		return res.status(400).send('No user with such email found');
	}

	async getUserCount(req, res, next) {
		try {
			let userCount = await _userService.countDocuments({});// returns a number of cars in db

			if (!userCount) {
				res.status(500).json({ success: false })
			}
			res.send({ Count: userCount });
		}
		catch (error) {
			next(error);
		}
	}


	async editUser(req, res, next) {
		try {
			let editedUser = await _userService.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }); // args" (id of the user to edit, what to edit, return edited one or old)
			return res.send(editedUser);
		}
		catch (error) {
			next(error);
		}
	}

	async deleteUser(req, res, next) {
		try {
			let deletedUser = await _userService.findOneAndDelete({ _id: req.params.id }); // args" (id of the user to delete (in our case by id))
			return res.send("Deleted");
		}
		catch (error) {
			next(error);
		}
	}
}