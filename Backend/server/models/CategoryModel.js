import mongoose from 'mongoose';

const Schema = mongoose.Schema // Schema defines how the object looks like in the db

// define a car model
const categorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ''
	},
	icon: {
		type: String
	}
});

// export outside
module.exports = categorySchema;