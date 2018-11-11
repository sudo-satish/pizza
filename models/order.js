var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { CartSchema } = require('./cart');

var moment = require('moment')

var OrderSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    cart: CartSchema,
    phone: {type: Number},
    orderNumber: {type: Number},
    isOnline: {type: Boolean, default: false},
    isPaid: {type: Boolean, default: true},
    status: {type: String, enum: ['Hold', 'Completed', 'Pending'], default: 'Pending'}
}, {
        timestamps: true,
        collection: 'Order',
        strict: true,
        versionKey: false
    });

OrderSchema.pre('save', async function(next) {
    let orderNumber = this.get('orderNumber');
    
    if (!orderNumber) {

        var today = moment().startOf('day')
        var tomorrow = moment(today).endOf('day')

        let where = {
            createdAt: {
                $gte: today.toDate(),
                $lt: tomorrow.toDate()
            }
        };

        let lastOrderNumber = await OrderModel.find(where).sort({_id: -1}).limit(1).exec();
        
        if (!lastOrderNumber || lastOrderNumber.length == 0) {
            lastOrderNumber = 0;
        } else {
            lastOrderNumber = lastOrderNumber[0].orderNumber;
        }
        
        this.set('orderNumber', (lastOrderNumber + 1));
    }

    next();
})

OrderSchema.statics.getOrderQueue = function(client) {

    let where = {
        client,
        status: 'Pending'
    }

    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.find(where)
        .where('createdAt').gte(start).lt(end)
        .sort({_id: 1}).exec()
}

OrderSchema.statics.placeOrder = async function (client, cart, phone) {

    if (!cart) {
        throw new Error('Cart not found!');
    }

    let order = {
        cart,
        client: client.get('_id'),
        phone
    }

    order = OrderModel.create(order);
    await cart.remove();
    return order;
}

OrderSchema.statics.getYesterdayOrder = async function() {
    var today = moment().subtract('1', 'days').startOf('day');
    var tomorrow = moment(today).endOf('day');

    let where = {
        // createdAt: {
        //     $gte: today.toDate(),
        //     $lt: tomorrow.toDate()
        // },
        status: 'Completed'
    };

    return this.find(where);
}

/**
 * Get Month Sale detail
 * 
 * { client: ObjectId("5be1c7eee141f8562cf4a3ce")
 */
OrderSchema.statics.getMonthSale = function(where = {}) {

    return this.aggregate([
        {
            $match: where
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" }, client: "$client" },
                totalAmount: { $sum: "$cart.totalAmount" },
                totalQuantity: { $sum: "$cart.totalItem" },
                orderCount: { $sum: 1 }
            }
        }
    ])
}

/**
 * Get user wise sale of a client.
 * 
 */
OrderSchema.statics.getUserSale = function(where = {}) {

    return this.aggregate([
        {
            $match: where
        },
        {
            $group: {
                _id: "$phone",
                totalAmount: { $sum: "$cart.totalAmount" },
                totalQuantity: { $sum: "$cart.totalItem" },
                orderCount: { $sum: 1 }
            }
        }
    ])
}

let OrderModel = mongoose.model('Order', OrderSchema);
module.exports = { OrderModel, OrderSchema } 
