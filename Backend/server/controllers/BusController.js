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
				category: '6133863e4ec7d025ad73f9f6' // bus object id
			})
				.populate('tags')
				.populate('category');
			return res.send(buses);
		}
		catch (error) {
			next(error);
		}
	}
}