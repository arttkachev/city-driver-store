// controller handles requests/responds

import express from 'express';
import CarService from "../services/CarService";
const mongoose = require('mongoose');

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class CarController {
	constructor() {
		this.router = express.Router()
			.get('', this.getCars)
			.get('/:id', this.getCarById)
			.get('/get/count', this.getCarsCount)
			.get('/get/featured/:count', this.getFeaturedCars)
			.post('', this.addCar)
			.put('/:id', this.editCar)
			.delete('/:id', this.deleteCar)
	}
	// _carService.find({}).select(<fields you are interested>) - _carService.find({}).select(name icon -_id) = will show name field and icon field and exclude _id (in args it is minus_id)
	async getCars(req, res, next) {
		try {
			// query format: localhost:3000/cars?categories=613386564ec7d025ad73f9f8,8876386564ec7d025ad73f9
			let filter = {};
			if (req.query.categories) {
				filter = { category: req.query.categories.split(',') } // filter to show cars by specified categories
			}
			let car = await _carService.find(filter) // use query filter in request
				.populate('tags')
				.populate('category')
			return res.send(car);
		}
		catch (error) {
			next(error);
		}
	}

	async getCarById(req, res, next) {
		try {
			if (mongoose.isValidObjectId(req.params.id)) {
				let carById = await _carService.findById(req.params.id);
				return res.send(carById);
			}
			else {
				res.status(400).send('Invalid Object Id');
			}

		}
		catch (error) {
			next(error);
		}
	}

	async getCarsCount(req, res, next) {
		try {
			let carCount = await _carService.countDocuments({});// returns a number of cars in db

			if (!carCount) {
				res.status(500).json({ success: false })
			}
			res.send({ Count: carCount });
		}
		catch (error) {
			next(error);
		}
	}

	async getFeaturedCars(req, res, next) {
		try {
			const count = req.params.count ? req.params.count : 0;
			let featuredCars = await _carService.find({ IsFeatured: true }).limit(+count); // +count converts count to Number. Initially req.params.count returns String. .limit() limits the number of cars shown

			if (!featuredCars) {
				res.status(500).json({ success: false })
			}
			res.send(featuredCars);
		}
		catch (error) {
			next(error);
		}
	}

	async addCar(req, res, next) {
		try {
			let newCar = await _carService.create(req.body); // mongo create method and we passing in a request body as a param. As mentioned above we have an access to all functionality of the db thorugh the service (see implementation) 
			return res.send(newCar);
		}
		catch (error) {
			next(error);
		}
	}

	async editCar(req, res, next) {
		if (mongoose.isValidObjectId(req.params.id)) {
			const { id: _id } = req.params;
			const editedCar = await _carService.findOneAndUpdate(
				{ _id },
				[{
					$set: {
						name: {
							$cond: { if: req.body.name != null, then: req.body.name, else: '$name' }
						},
						category: {
							$cond: { if: req.body.category != null, then: req.body.category, else: '$category' }
						},
						description: {
							$cond: { if: req.body.description != null, then: req.body.description, else: '$description' }
						},
						capacity: {
							$cond: { if: req.body.capacity != null, then: req.body.capacity, else: '$capacity' }
						},
						icon: {
							$cond: { if: req.body.icon != null, then: req.body.icon, else: '$icon' }
						},
						year: {
							$cond: { if: req.body.year != null, then: req.body.year, else: '$year' }
						},
						color: {
							$cond: { if: req.body.color != null, then: req.body.color, else: '$color' }
						},
						price: {
							$cond: { if: req.body.price != null, then: req.body.price, else: '$price' }
						},
						// multiple tags can be added in one call ["tag1", "tag2", ...], but deletion of tags must be done sequentially by single value "tag1" and then "tag2" in several calls
						// because $in: aggregation checks a value in a specified array only
						tags: {
							$cond: [
								{ $in: [req.body.tags, '$tags'] }, { $setDifference: ['$tags', [req.body.tags]] }, { $concatArrays: ['$tags', req.body.tags] }
							]
						}
					}
				}
				], { new: true });
			return res.send(editedCar);
		}

		return res.send({ updateResult: false, message: 'Invalid Object Id' });
	}

	async deleteCar(req, res, next) {
		try {
			let deletedCar = await _carService.findOneAndDelete({ _id: req.params.id }); // args" (id of the car to delete (in our case by id))
			return res.send("Deleted");
		}
		catch (error) {
			next(error);
		}
	}
}