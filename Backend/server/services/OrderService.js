// service provides functionality to "talk" to a database through repository and a model itself

import mongoose from 'mongoose'
const orderSchema = require('../models/Order');

// create an instance of the model
const _model = orderSchema;

// expose the repository. We use the repository to contact with db and have an access to a db through the repository
export default class OrderService {
	get repository() {
		return mongoose.model('order', _model, 'orders') // this makes available all methods from mongo db (CRUD operations) // params (name of the model, model definition)
	}
}