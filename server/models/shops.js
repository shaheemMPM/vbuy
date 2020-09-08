const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shopSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    branch: { type: String, required: true }
});

module.exports = mongoose.model('Shops', shopSchema);