const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const subCategorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true},
    categoryId: {type: objectId, required: true},
    products: {type:[objectId], default:[]}
});

module.exports = mongoose.model('SubCategories', subCategorySchema);