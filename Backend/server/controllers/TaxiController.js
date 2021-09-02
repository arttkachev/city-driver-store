import express from 'express';
import CarService from "../services/CarService";

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class TaxiController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllTaxi)
	}

	async getAllTaxi(req, res, next) {
		try {
			let taxi = await _carService.find({
				category: 'Taxi'
			}).populate('tags');
			return res.send(taxi);
		}
		catch (error) {
			next(error);
		}
	}
}