const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true},
    batchCode: { type: String, required: true },
    image: [String],
    popular: { type: Boolean, default: false },
    subcategoryId: {type: objectId, required:true}
});

module.exports = mongoose.model('Products', productSchema);