const mongoose = require('mongoose');
const fileUtil = require('../../utils/file');
const { Schema } = mongoose;

const collectionSchema = new Schema({
    name: { type: String, required: [true, 'Collection name is required'], unique: true, min: 2, max: 25 },
    image: { type: String },
    description: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: 'product' }],
});

module.exports = mongoose.model('collection', collectionSchema);


collectionSchema.set('toJSON', {
    virtuals: true
});

collectionSchema.set('toObject', {
    virtuals: true
});
