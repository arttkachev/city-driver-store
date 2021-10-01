// controller handles requests/responds

import express from 'express';
import CarService from "../services/CarService";
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv/config');

// expose our model and functionality to talk to db through CarService
let _carService = new CarService().repository;

// uploads
// Specify extensions we want to be validated on server. This is mimetype format
const FILE_TYPE_MAP = {
	'icon/png': 'png', // icon name is what frontend sends
	'icon/jpeg': 'jpeg',
	'icon/jpg': 'jpg',

}
const uploadPath = process.env.UPLOAD_PATH;
const urlUploadPath = process.env.URL_UPLOAD_PATH;
const storage = multer.diskStorage({
	destination: function (req, file, cb) { // function to check a destination path and validity of extension
		const isValidExtension = FILE_TYPE_MAP[file.mimetype]; // valid if extention (mimetype) found in map of valid extentions for uploading on server
		let uploadError = new Error('invalid icon type');
		if (isValidExtension) {
			uploadError = null;
		}

		cb(null, `${uploadPath}`)  // callback function params (error, destination path on server machine)
	},
	filename: function (req, file, cb) { // func renames files to specific name format when user uploads files 
		const fileName = file.originalname.split(' ').join('-'); // replaces any spaces with '-'
		const extension = FILE_TYPE_MAP[file.mimetype]; // find valid file extension for uploading on server
		cb(null, `${fileName}`) // adds filename, date of creation at the end of filename and extension
	}
});

const uploadOptions = multer({ storage: storage });

export default class CarController {
	constructor() {
		this.router = express.Router()
			.get('', this.getCars)
			.get('/:id', this.getCarById)
			.get('/get/count', this.getCarsCount)
			.get('/get/featured/:count', this.getFeaturedCars)
			.post('', uploadOptions.single('icon'), this.addCar) // uploadOptions.single('icon') - field name (icon) we want to send from frontend for uploading images
			.put('/:id', this.editCar)
			.put('/gallery/:id', uploadOptions.array('gallery', 10), this.editGalleryById) // uploadOptions.array('gallery', 10) - update array of images with max count of 10 in one request
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
			const fileName = req.file.fileName; // fileName is the name of var from the function specified in multer.diskStorage above. const fileName = file.originalname.split(' ').join('-'); it comes with user request
			const basePath = `${req.protocol}://${req.get('host')}${urlUploadPath}`; // http://localhost:3000/public/uploads/image-2323232
			if (!req.file) {
				return res.status(400).send('No image for upload');
			}
			let newCar = await _carService.create({
				name: req.body.name,
				category: req.body.category,
				description: req.body.description,
				capacity: req.body.capacity,
				icon: `${basePath}${fileName}`, // icon comes from user request. URL is formed from base path on server for images and name of the file that user uploads
				year: req.body.year,
				color: req.body.color,
				price: req.body.price,
				tags: req.body.tags,
			}); // mongo create method and we passing in a request body as a param. As mentioned above we have an access to all functionality of the db thorugh the service (see implementation) 
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
							$cond: [{ $in: [{ $first: [{ $ifNull: [req.body.tags, []] }] }, '$tags'] }, { $setDifference: ['$tags', req.body.tags] }, { $concatArrays: ['$tags', { $ifNull: [req.body.tags, []] }] }]
						}
					}
				}
				], { new: true });
			return res.send(editedCar);
		}

		return res.send({ updateResult: false, message: 'Invalid Object Id' });
	}

	async editGalleryById(req, res, next) {
		if (mongoose.isValidObjectId(req.params.id)) {
			const basePath = `${req.protocol}://${req.get('host')}${urlUploadPath}`;
			const files = req.files;
			let imagePaths = [];
			if (files) {
				files.map(file => {
					imagePaths.push(`${basePath}${file.fileName}`);
				})

			}

			const editedGallery = await _carService.findByIdAndUpdate(
				req.params.id,
				{
					gallery: imagePaths
				},
				{ new: true }
			);

			if (!editedGallery) {
				return res.status(500).send('Gallery cannot be updated');
			}
			return res.send(editedGallery);

		}

		res.send({ updateResult: false, message: 'Invalid Object Id' });
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