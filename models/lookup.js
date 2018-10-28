var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lookupSchema = new Schema({
    
    translation_type: {type: String, required: true },
    code: {type: String, required: true },
    meaning: {type: String, required: true },
    order: {type: Number, required: true },
    active: {type: Boolean, default: true },
    description: {type: String },
    
}, {
        timestamps: true,
        collection: 'Lookup',
        strict: true,
        versionKey: false
    });

lookupSchema.statics.lov = async function (translation_type) {
    return this.find({ translation_type, active: true }).sort('order').select('code meaning tip').exec();
}

lookupSchema.statics.getTypeId = async function(where) {
    let type = await this.findOne(where).select('_id').exec();
    return type.get('_id');
}

module.exports = mongoose.model('Lookup', lookupSchema);
