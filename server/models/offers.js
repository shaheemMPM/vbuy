const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const offersSchema = new Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  products: { type: [ObjectId], default: [] },
});

module.exports = mongoose.model('Offers', offersSchema);