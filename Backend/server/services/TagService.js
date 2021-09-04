// service provides functionality to "talk" to a database through repository and a model itself

import mongoose from 'mongoose'
const tagSchema = require('../models/TagModel'); // import car schema

// create an instance of the model
const _model = tagSchema;

// expose the repository. We use the repository to contact with db and we have an access to a db through the repository
export default class TagService {
	get repository() {
		return mongoose.model('tag', _model, 'tags') // this makes available all methods from mongo db (CRUD operations) // args (name of the model, model definition)
	}
}