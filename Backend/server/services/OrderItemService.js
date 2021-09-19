// service provides functionality to "talk" to a database through repository and a model itself

import mongoose from 'mongoose'
const orderItemSchema = require('../models/OrderItem');

// create an instance of the model
const _model = orderItemSchema;

// expose the repository. We use the repository to contact with db and have an access to a db through the repository
export default class OrderItemService {
	get repository() {
		return mongoose.model('orderItem', _model, 'orderItems') // this makes available all methods from mongo db (CRUD operations) // params (name of the model, model definition)
	}
}