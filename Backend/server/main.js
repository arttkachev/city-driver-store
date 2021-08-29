import express from "express"; // grab express library. require('express') is something like import library
import DBContext from "./db/dbconfig";

require('dotenv/config'); // grab library that allows to read public vars from .env file

// create server
let server = express();
const port = 3000;

// connect to db
DBContext.connect();

// routes
server.get('/', (req, res, next) => {
	res.send('City Driver Backend');
})

// start listening requests by server
server.listen(port, () => {
	console.log("Server is listening to a port:", port);
})