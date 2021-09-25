// controller handles requests/responds

import express from 'express';
import OrderItemService from '../services/OrderItemService'
import OrderService from '../services/OrderService';


// expose our model and functionality
const _orderService = new OrderService().repository;
const _orderItemService = new OrderItemService().repository;

export default class OrderController {
	constructor() {
		this.router = express.Router()
			.get('', this.getAllOrders)
			.get('/:id', this.getOrderById)
			.get('/get/userorders/:userid', this.getUserOrders)
			.get('/get/totalsales', this.getTotalSales)
			.get('/get/count', this.getOrdersCount)
			.post('', this.addOrder)
			.put('/:id', this.editOrder)
			.delete('/:id', this.deleteOrder)
	}

	async getAllOrders(req, res, next) {
		try {
			// .populate('user', 'name'); shows only name of the user
			// .sort('dateOfOrder'); sorts results by dateOfOrders from oldest to newest
			// .sort({ 'dataOfOrder': -1}); sorts results by dateOfOrder from newest to oldest
			let order = await _orderService.find({}).populate('user', 'name').sort({ 'dateOfOrder': -1 });
			return res.send(order);
		}
		catch (error) {
			next(error);
		}
	}

	async getUserOrders(req, res, next) {
		try {
			// .populate('user', 'name'); shows only name of the user
			// .sort('dateOfOrder'); sorts results by dateOfOrders from oldest to newest
			// .sort({ 'dataOfOrder': -1}); sorts results by dateOfOrder from newest to oldest
			const userOrderList = await _orderService.find({ user: req.params.userid }).populate('user', 'name')
				.populate({ // this is a way how to populate subcategories
					path: 'orderItems', populate: {
						path: 'item', populate: 'category'
					}
				}).sort({ 'dataOfOrder': -1 });
			if (!userOrderList) {
				return res.status(400).send('User Order List is empty');
			}

			return res.status(200).send(userOrderList);
		}
		catch (error) {
			next(error);
		}

	}

	async getOrderById(req, res, next) {
		try {
			let orderById = await _orderService.findById(req.params.id)
				.populate('user', 'name')
				.populate({ // this is a way how to populate subcategories
					path: 'orderItems', populate: {
						path: 'item', populate: 'category'
					}
				});
			return res.send(orderById);
		}
		catch (error) {
			next(error);
		}
	}

	// stat method
	async getTotalSales(req, res, next) {
		const totalSales = await _orderService.aggregate([
			{ $group: { _id: null, totalSales: { $sum: '$totalPrice' } } } // Mongoose specification requires _id: and a field we want to return. $totalPrice is field specified in Order Schema
		]);
		if (!totalSales) {
			return res.status(400).send('Cannot aggregate data');
		}
		res.send({ totalSales: totalSales.pop().totalSales }); // pop into array total sales
	}

	async getOrdersCount(req, res, next) {
		try {
			const orderCount = await _orderService.countDocuments({});// returns a number of order count in db

			if (!orderCount) {
				res.status(500).json({ success: false })
			}
			res.send({ Count: orderCount });
		}
		catch (error) {
			next(error);
		}
	}

	async addOrder(req, res, next) {
		try {
			let totalPrices = [];
			// we want to automatically extract ids of order items in db for frontend POST request
			// first, loop through order items in user request to extract data they contain. req.body.orderItems is array (see declaration)
			const orderItemdsIds = Promise.all(req.body.orderItems.map(async orderItem => { // Promise.all() because function returns an array of promises due to async work and by Promise.all() we combine them together
				let newOrderItem = await _orderItemService.create({
					item: orderItem.item,
					quantity: orderItem.quantity
				})

				// and then, save new order items in db
				//newOrderItem = await newOrderItem.save();

				// calculate total price of each order item
				// first, find new just created order item by id to figure out its price for single item
				const orderItemTotalPrice = await _orderItemService.findById(newOrderItem._id).populate('item', 'price');
				// and calculate total
				totalPrices.push(orderItemTotalPrice.item.price * newOrderItem.quantity);


				// we want to return ids of order items only to use them on POST request below
				return newOrderItem._id;
			}));

			// before creating new order we need to resolve promises (wait once async functions finished their work - see above) because we need item orders, not promises
			// in other words, wait once async callback function from above finished its work for extracting orders items data from frontend POST request
			const orderItemsIdsResolved = await orderItemdsIds;

			// calculate total price for the order
			const totalOrderPrice = totalPrices.reduce((a, b) => a + b, 0);

			let newOrder = await _orderService.create({
				orderItems: orderItemsIdsResolved,
				shippingAddress1: req.body.shippingAddress1,
				shippingAddress2: req.body.shippingAddress2,
				city: req.body.city,
				zip: req.body.zip,
				country: req.body.country,
				phone: req.body.phone,
				status: req.body.status,
				user: req.body.user,
				dateOfOrder: req.body.dateOfOrder,
				totalPrice: totalOrderPrice,
			}); // mongo create method and we passing in a request body as a param. As mentioned above we have an access to all functionality of the db thorugh the service (see implementation)
			return res.send(newOrder);
		}
		catch (error) {
			next(error);
		}
	}

	async editOrder(req, res, next) {
		try {
			let editedOrder = await _orderService.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }); // args" (id of the order to edit, what to edit, return edited one or old)
			return res.send(editedOrder);
		}
		catch (error) {
			next(error);
		}
	}

	async deleteOrder(req, res, next) {
		// first, remove order
		let deletedOrder = _orderService.findOneAndDelete({ _id: req.params.id }).then(async order => { // then loop through all order items in order
			if (order) {
				await order.orderItems.map(async orderItem => {
					await _orderItemService.findByIdAndRemove(orderItem) // and remove it
				})
				return res.send("Deleted");
			}
			else {
				return res.status(400).json({ success: false, message: 'Failed to delete order' });
			}
		}).catch(err => {
			return res.status(500).json({ success: false, error: err });
		})
	}
}