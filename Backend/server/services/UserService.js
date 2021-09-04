// service provides functionality to "talk" to a database through repository and a model itself

import mongoose from 'mongoose'
const userSchema = require('../models/UserModel'); // import car schema

// create an instance of the model
const _model = userSchema;

// expose the repository. We use the repository to contact with db and have an access to a db through the repository
export default class UserService {
	get repository() {
		return mongoose.model('user', _model, 'users') // this makes available all methods from mongo db (CRUD operations) // args (name of the model, model definition)
	}
}