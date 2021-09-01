// import car model
const { carModel } = require('../models/carModel'); // when exporting carModel (see carModel.js) in this way, it returns an object
import express from 'express';

// create router
const router = express.Router();

// GET router
router.get('', async (req, res, next) => {
	const carList = await carModel.find();

	if (!carList) {
		res.status(500).json({ success: false })
	}

	res.send(carList);
})

// POST router
router.post('', (req, res, next) => {

	// create new car from request body	
	const car = new carModel({
		name: req.body.name,
		category: req.body.category,
		description: req.body.description,
		capacity: req.body.capacity,
		icon: req.body.icon,
		color: req.body.color,
		price: req.body.price

	})
	// save new data to db
	car.save().then((createdCar => {
		res.status(201).json(createdCar) // send succesful status and created data in a json format with a callback (we will see a created data in postman after POST request)
		// catch errors
	})).catch((err) => {
		res.send(err);
	})
})


// export module to have it available outside
module.exports = router;