// controller handles requests/responds

import express from 'express';
import CategoryService from "../services/CategoryService";

// expose our model and functionality to talk to db through GarageService
let _categoryService = new CategoryService().repository;

export default class CategoryController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllCategories)
			.get('/:id', this.getCategoryById)
			.post('', this.addCategory)
			.put('/:id', this.editCategory)
			.delete('/:id', this.deleteCategory)
	}

	async getAllCategories(req, res, next) {
		try {
			let category = await _categoryService.find({});
			return res.send(category);
		}
		catch (error) {
			next(error);
		}
	}

	async getCategoryById(req, res, next) {
		try {
			let categoryById = await _categoryService.findById(req.params.id);
			return res.send(categoryById);
		}
		catch (error) {
			next(error);
		}
	}

	async addCategory(req, res, next) {
		try {
			let newCategory = await _categoryService.create(req.body); // mongo create method and we passing in a request body as a param. As mentioned above we have an access to all functionality of the db thorugh the service (see implementation) 
			return res.send(newCategory);
		}
		catch (error) {
			next(error);
		}
	}

	async editCategory(req, res, next) {
		try {
			let editedCategory = await _categoryService.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }); // args" (id of the category to edit, what to edit, return edited one or old)
			return res.send(editedCategory);
		}
		catch (error) {
			next(error);
		}
	}

	async deleteCategory(req, res, next) {
		// for practice purposes handle deletion by another way
		let deletedCategory = _categoryService.findOneAndDelete({ _id: req.params.id }).then(category => {
			if (category) {
				return res.send("Deleted");
			}
			else {
				return res.status(400).json({ success: false, message: 'Failed to delete category' });
			}
		}).catch(err => {
			return res.status(400).json({ success: false, error: err });
		})
	}

}