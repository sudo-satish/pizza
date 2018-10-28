var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientSchema = new Schema({
        name: { type: String, required: 'Name is required' },
        image: { type: String, required: 'Image is required' }
    }, {
        timestamps: true,
        collection: 'Ingredient',
        strict: true,
        versionKey: false
    });

module.exports = mongoose.model('Ingredient', ingredientSchema);
