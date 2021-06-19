const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const salesSchema = new Schema({
    productId: { type: ObjectId, required: true },
    selectedSize: { type: String, required: false },
    quantity: { type: String, required: true },
    shopId: { type: ObjectId, required: true },
    orderId: { type: ObjectId, required: true },
    userId: { type: ObjectId, required: true },
    amount: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    timestamp: {type: Number, required: true}
})

module.exports = mongoose.model('Sales', salesSchema);