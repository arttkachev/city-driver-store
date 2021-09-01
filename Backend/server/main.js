import CarController from './controllers/carController';
import DBContext from "./db/dbconfig";
const express = require("express"); // grab express library. require('express') is something like import library
require('dotenv/config'); // grab library that allows to read public vars from .env file

// create server
let server = express();
const port = 3000;

// middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// routers
server.use('/garage/cars', new CarController().router)

// connect to db
DBContext.connect();

// check request
server.get('/', (req, res, next) => {
	res.send('City Driver Backend');
})

// start listening requests by server
server.listen(port, () => {
	console.log("Server is listening to a port:", port);
})