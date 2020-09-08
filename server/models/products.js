const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    categoryId: { type: String, required: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true},
    batchCode: { type: String, required: true },
    image: [String]
});

module.exports = mongoose.model('Products', productSchema);