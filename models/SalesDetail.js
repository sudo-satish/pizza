var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SalesDetailSchema = new Schema({
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    daily: 
        [   { 
                quantity: Number, 
                amount: Number,
                date: {type: Date, default: new Date()}
            }
        ],
    totalQuantity: Number, 
    totalAmount: Number,
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
}, {
        timestamps: true,
        collection: 'SalesDetail',
        strict: true,
        versionKey: false
    });

let SalesDetailModel = mongoose.model('SalesDetail', SalesDetailSchema);
module.exports = { SalesDetailModel, SalesDetailSchema};

