// service provides functionality to "talk" to a database through repository and a model itself

import mongoose from 'mongoose'
const categorySchema = require('../models/CategoryModel'); // import car schema

// create an instance of the model
const _model = categorySchema;

// expose the repository. We use the repository to contact with db and have an access to a db through the repository
export default class CategoryService {
	get repository() {
		return mongoose.model("category", _model, 'categories') // this makes available all methods from mongo db (CRUD operations) // args (name of the model, model definition)
	}
}