import mongoose from 'mongoose';
const carSchema = require('../models/CarModel'); // import car schema

const Schema = mongoose.Schema // Schema defines how the object looks like in the db
const ObjectId = Schema.Types.ObjectId // ObjectId references to the object id in db

// define a car model
const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Number, required: true },
	balance: { type: Number, default: 10000 },
	purchased: [String]

});

// create virtual "id" field (more fronend friendly)
userSchema.virtual('id').get(function () {
	return this._id.toHexString();
})

// activate virtuals
userSchema.set('toJSON', {
	virtuals: true,
})

// export outside
module.exports = userSchema;