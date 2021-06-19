const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const offersSchema = new Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  products: { type: [ObjectId], default: [] }, //shop-id, image,
  shopId: { type: ObjectId, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Offers", offersSchema);
