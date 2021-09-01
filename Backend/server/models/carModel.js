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

// define a var that stores our model (args:(name of the model, reference to the schema that defines this specific model))
// exports. to make a Car variable available in other files of the node.js project. Then, it is possible to import this data with a require() method in other files
exports.carModel = mongoose.model('carModel', carSchema);