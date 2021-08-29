import mongoose from "mongoose";

// grab dotnev library to read from .env
require('dotenv/config');
const connectionString = process.env.CONNECTION_STRING;

export default class DBContext {

	// static promise method to connect to db
	static async connect() {
		try {
			let status = await mongoose.connect(connectionString);
			console.log('Connection to database is established');
			return status;
		}
		catch (error) {
			console.log(error);
		}
	}
}