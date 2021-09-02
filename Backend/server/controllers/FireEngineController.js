import express from 'express';
import CarService from "../services/CarService";

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class FireEngineController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllFireEngines)
	}

	async getAllFireEngines(req, res, next) {
		try {
			let fireEngines = await _carService.find({
				category: 'Fire Engine'
			}).populate('tags');
			return res.send(fireEngines);
		}
		catch (error) {
			next(error);
		}
	}
}