// controller handles requests/responds

import express from 'express';
import TagService from "../services/TagService";

// expose our model and functionality to talk to db through TagService
let _tagService = new TagService().repository;

export default class TagController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllTags)
			.get('/:id/car', this.getCarByTagId)
			.post('', this.addTag)
			.put('/:id', this.editTag)
			.delete('/:id', this.deleteTag)
	}

	async getAllTags(req, res, next) {
		try {
			let tag = await _tagService.find({});
			return res.send(tag);
		}
		catch (error) {
			next(error);
		}
	}

	async getCarByTagId(req, res, next) {
		try {
			let car = await _tagService.findById(req.params.id);
			return res.send(car);
		}
		catch (error) {
			next(error);
		}
	}

	async addTag(req, res, next) {
		try {
			let newTag = await _tagService.create(req.body); // mongo create method and we passing in a request body as a param. As mentioned above we have an access to all functionality of the db thorugh the service (see implementation) 
			return res.send(newTag);
		}
		catch (error) {
			next(error);
		}
	}

	async editTag(req, res, next) {
		try {
			let editedTag = await _tagService.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }); // args" (id of the tag to edit, what to edit, return edited one or old)
			return res.send(editedTag);
		}
		catch (error) {
			next(error);
		}
	}

	async deleteTag(req, res, next) {
		try {
			let deletedTag = await _tagService.findOneAndDelete({ _id: req.params.id }); // args" (id of the tag to delete (in our case by id))
			return res.send("Deleted");
		}
		catch (error) {
			next(error);
		}
	}
}