import mongoose from 'mongoose';
const carSchema = require('../models/CarModel'); // import car schema

const Schema = mongoose.Schema // Schema defines how the object looks like in the db
const ObjectId = Schema.Types.ObjectId // ObjectId references to the object id in db

// define a car model
const userSchema = new Schema({
	name: String,
	email: String,
	password: String,
	capacity: Number,
	balance: Number,
	cars: [{ type: ObjectId, ref: "car" }]

});

// export outside
module.exports = userSchema;