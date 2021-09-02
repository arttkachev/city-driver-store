// CarModel is going to be used for all types of cars in the game (buses, taxi, trucks and etc.)

import mongoose from 'mongoose';

const Schema = mongoose.Schema // Schema defines how the object looks like in the db
const ObjectId = Schema.Types.ObjectId // ObjectId references to the object id in db

// define a car model
const carSchema = new Schema({
	name: String,
	category: String,
	description: String,
	capacity: Number,
	icon: String,
	year: String,
	color: String,
	price: Number,
	tags: [{ type: ObjectId, ref: "tag" }]
});

// export outside
module.exports = carSchema;
