// controller handles requests/responds

import express from 'express';
import UserService from "../services/UserService";
const bcrypt = require('bcryptjs'); // hashing passwords

// expose our model and functionality to talk to db through UserService
let _userService = new UserService().repository;

export default class UserController {
	constructor() {
		this.router = express.Router()
			.get('', this.getUsers)
			.get('/:id/user', this.getUserById)
			.post('', this.addUser)
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

	async addUser(req, res, next) {
		try {
			let newUser = await _userService.create({
				name: req.body.name,
				email: req.body.email,
				passwordHash: bcrypt.hashSync(req.body.passwordHash), // hashing password
				isAdmin: req.body.isAdmin,
				balance: req.body.balance,
				purchased: req.body.purchased
			}); // mongo create method and we passing in a request body as a param. As mentioned above we have an access to all functionality of the db thorugh the service (see implementation)
			return res.send(newUser);
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