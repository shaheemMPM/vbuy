const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema({
    productDetails: [{
        productId: { type: ObjectId, required: true },
        selectedSize: { type: String, required: true },
        quantity: { type: String, required: true }
    }],
    userId: { type: ObjectId, required: true },
    address: {
        name:{ type: String, required: true },
        houseNo: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode:{ type: String, required: true },
        mobile: { type: String, required: true },
        altMobile: { type: String, required: false }
    },
    currentStatus: {type: String, required: true, default:"PLACED"},
    modeOfPayment: { type: String, required: true },
    discountPrice: { type: String, required: true },
    totalSgst: { type: String, required: true },
    totalCgst: { type: String, required: true },
    netAmount: { type: String, required: true },
    orderImage : {type: String, required:true},
    totalItems : {type: Number, required: true, default:0}
})

module.exports = mongoose.model('Orders', orderSchema);