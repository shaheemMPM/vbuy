const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true},
    batchCode: { type: String, required: true },
    image: [String],
    popular: { type: Boolean, default: false },
    subcategoryId: { type: ObjectId, required:true },
    sgst: { type: Number, required: true },
    cgst: { type: Number, required: true },
    offer: { type: Boolean, required: false, default: false },
    offerId: { type: ObjectId, required:false, default: null },
    offerPrice: { type: Number, required: false },
    size_chart: { type: [String], default: [] },
    pincode_list: { type: [Number], default: [] }
});

module.exports = mongoose.model('Products', productSchema);