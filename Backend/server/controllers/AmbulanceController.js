import express from 'express';
import CarService from "../services/CarService";

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

export default class AmbulanceController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllAmbulance)
	}

	async getAllAmbulance(req, res, next) {
		try {
			let ambulance = await _carService.find({
				category: 'Ambulance'
			}).populate('tags');
			return res.send(ambulance);
		}
		catch (error) {
			next(error);
		}
	}
}