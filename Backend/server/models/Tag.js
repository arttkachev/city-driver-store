import mongoose from 'mongoose';

const Schema = mongoose.Schema // Schema defines how the object looks like in the db

// define a car model
const tagSchema = new Schema({
	tags: [{
		type: String
	}]
});

// export outside
module.exports = tagSchema;