const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  shopId: { type: ObjectId, required: true },
  categoryId: { type: ObjectId, required: true },
  subcategoryId: { type: ObjectId, required: true },
  batchCode: { type: String, required: true },
  image: [String],
  popular: { type: Boolean, default: false },
  sgst: { type: Number, required: true },
  cgst: { type: Number, required: true },
  offer: { type: Boolean, required: false, default: false },
  offerId: { type: ObjectId, required: false, default: null },
  offerPrice: { type: Number, required: false },
  size_chart: { type: [String], default: [] },
  pincode_list: { type: [Number], default: [] },
  isActive: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("Products", productSchema);
