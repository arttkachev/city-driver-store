import express from 'express';
import CarService from "../services/CarService";

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class TruckController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllTrucks)
	}

	async getAllTrucks(req, res, next) {
		try {
			let trucks = await _carService.find({
				category: '6133867d4ec7d025ad73f9fa' // trucks object id
			})
				.populate('tags')
				.populate('category');
			return res.send(trucks);
		}
		catch (error) {
			next(error);
		}
	}
}