// controller handles requests/responds

import express from 'express';
import CarService from "../services/CarService";

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class CarController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllCars)
			.get('/:id/car', this.getCarById)
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
			let carById = await _carService.findById(req.params.id);
			return res.send(carById);
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
		try {
			let editedCar = await _carService.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }); // args" (id of the car to edit, what to edit, return edited one or old)
			return res.send(editedCar);
		}
		catch (error) {
			next(error);
		}
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