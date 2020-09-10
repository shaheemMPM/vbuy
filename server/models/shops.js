const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const objectId = Schema.objectId;

const shopSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    branch: { type: String, required: true },
    categories: { type: [objectId], default: [] }
});

module.exports = mongoose.model('Shops', shopSchema);