// CarModel is going to be used for all types of cars in the game (buses, taxi, trucks and etc.)

import mongoose from 'mongoose';

const Schema = mongoose.Schema // Schema defines how the object looks like in the db
const ObjectId = Schema.Types.ObjectId // ObjectId references to the object id in db

// define a car model
const carSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: ObjectId,
		ref: 'category',
		required: true
	},
	description: {
		type: String
	},
	capacity: {
		type: Number
	},
	icon: {
		type: String,
		default: ''
	},
	gallery: [{
		type: String
	}],
	year: {
		type: String
	},
	color: {
		type: String
	},
	price: {
		type: Number,
		required: true
	},
	tags: [String]
});

// create a virtual "id" field (more fronend friendly)
carSchema.virtual('id').get(function () {
	return this._id.toHexString();
})

// activate virtuals
carSchema.set('toJSON', {
	virtuals: true,
})

// export outside
module.exports = carSchema;
