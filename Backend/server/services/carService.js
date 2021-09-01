// service provides functionality to "talk" to a database through repository and a model itself

import mongoose from 'mongoose'
const carSchema = require('../models/carModel'); // import car schema

const Schema = mongoose.Schema // Schema defines a model itself and defines how the object looks like in the db
const ObjectId = Schema.Types.ObjectId // ObjectId references to the object in db. We can have an access to the object in db by its id

// create an instance of the model
const _model = carSchema;

// expose the repository. We use the repository to contact with db and we have an access to a db through the repository
export default class CarService {
	get repository() {
		return mongoose.model("car", _model) // this makes available all methods from mongo db (CRUD operations) // args (name of the model, model definition)
	}
}