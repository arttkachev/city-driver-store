const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
	item: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'item',
	},
	quantity: {
		type: Number,
		required: true,
	},
})

//exports.OrderItem = mongoose.model('OrderItem', orderItemSchema); // the second way to export model outside it to be accessable by other files
module.exports = orderItemSchema;