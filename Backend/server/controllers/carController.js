// controller handles requests/responds

import express from 'express';
import CarService from "../services/CarService";
const mongoose = require('mongoose');

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class CarController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllCars)
			.get('/:id', this.getCarById)
			.get('/get/count', this.getCarsCount)
			.get('/get/featured/:count', this.getFeaturedCars)
			.get('/get/buses', this.getBuses)
			.get('/get/taxi', this.getTaxi)
			.get('/get/trucks', this.getTrucks)
			.post('', this.addCar)
			.put('/:id', this.editCar)
			.delete('/:id', this.deleteCar)
	}
	// _carService.find({}).select(<fields you are interested>) - _carService.find({}).select(name icon -_id) = will show name field and icon field and exclude _id (in args it is minus_id)
	async getAllCars(req, res, next) {
		try {
			let car = await _carService.find({})
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

	async getBuses(req, res, next) {
		try {
			let buses = await _carService.find({ category: '6133863e4ec7d025ad73f9f6' })
				.populate('tags')
				.populate('category');

			return res.send(buses);
		}
		catch (error) {
			next(error);
		}
	}

	async getTaxi(req, res, next) {
		try {
			let taxi = await _carService.find({ category: '613386564ec7d025ad73f9f8' })
				.populate('tags')
				.populate('category')
			return res.send(taxi);
		}
		catch (error) {
			next(error);
		}
	}

	async getTrucks(req, res, next) {
		try {
			let trucks = await _carService.find({ category: '6133867d4ec7d025ad73f9fa' })
				.populate('tags')
				.populate('category')
			return res.send(trucks);
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
						tags: {
							$cond: [
								{ $in: [req.body.tags, '$tags'] }, { $setDifference: ['$tags', [req.body.tags]] }, { $concatArrays: ['$tags', [req.body.tags]] }
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