// controller handles requests/responds

import express from 'express';
import CarService from "../services/CarService";

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class BusController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllBuses)
	}

	async getAllBuses(req, res, next) {
		try {
			let buses = await _carService.find({
				category: 'Bus'
			}).populate('tags');
			return res.send(buses);
		}
		catch (error) {
			next(error);
		}
	}
}