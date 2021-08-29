import mongoose from "mongoose";

// set options for connection (read official documentation)
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connection.on('error', err => {
	console.error('[DATABASE ERROR]:', err)
})

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