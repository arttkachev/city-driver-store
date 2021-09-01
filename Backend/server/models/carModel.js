import mongoose from 'mongoose';

// define a car model
const carSchema = mongoose.Schema({
	name: String,
	category: String,
	description: String,
	capacity: Number,
	icon: String,
	color: String,
	price: Number
});

// export outside
module.exports = carSchema;
