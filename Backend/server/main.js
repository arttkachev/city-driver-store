import CarController from './controllers/CarController';
import TagController from './controllers/TagController';
import UserController from './controllers/UserController';
import CategoryController from './controllers/CategoryController';
import DBContext from "./db/DBconfig";
const express = require("express"); // grab express library. require('express') is something like import library
require('dotenv/config'); // grab library that allows to read public vars from .env file
const cors = require('cors');



// create server
let server = express();
const port = 3000;

// use cors
server.use(cors());
server.options('*', cors()); // args (asteriks means cors is enabled for the entire server)

// middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// routers
server.use('/cars', new CarController().router);
server.use('/tags', new TagController().router);
server.use('/categories', new CategoryController().router);
server.use('/users', new UserController().router);

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