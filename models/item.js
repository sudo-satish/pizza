var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    type: { type: Schema.Types.ObjectId, ref: 'Lookup' }, // Translation Type: ITEM_TYPE;
    name: { type: String, required: 'Name is required' },
    rate: { type: Number, required: 'Rate is required' },
    description: { type: String},
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
    image: { type: String },
    isVeg: { type: Boolean },
    size: { type: Schema.Types.ObjectId, ref: 'Lookup' }, // Translation Type: ITEM_SIZE
    crust: { type: String }
}, {
        timestamps: true,
        collection: 'Item',
        strict: true,
        versionKey: false
    });


itemSchema.statics.lov = async function () {
    // Translation Type: ITEM_TYPE;
    // Translation Type: ITEM_SIZE
    return {
        size: await this.model('Lookup').lov('ITEM_SIZE'),
        type: await this.model('Lookup').lov('ITEM_TYPE'),
        ingredients: await this.model('Ingredient').find()
    }
}


itemSchema.statics.getDetail = async function (where) {
    return this.find(where)
        .populate({ path: 'ingredients', select: '-createdAt -updatedAt'})
        .populate({ path: 'type', select: '-active -translation_type -order -createdAt -updatedAt -_id -createdAt -updatedAt' })
        .select('-createdAt -updatedAt')
        .exec();
}

module.exports = mongoose.model('Item', itemSchema);
