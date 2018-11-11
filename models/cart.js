var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ItemSchema } = require('../models/item');

var CartSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    item: [{item: ItemSchema, quantity: Number, default: 0 }],
    totalAmount: {type: Number, default: 0},
    totalItem: { type: Number, default: 0},
    phone: {type: String}
    }, {
        timestamps: true,
        collection: 'Cart',
        strict: true,
        versionKey: false
    });

/**
 * Add Item to Cart.
 */
CartSchema.statics.addToCart = async function(client, item, quantity = 1) {
    
    let clientId = client.get('_id');

    let cart = await this.findOne({ client: clientId });
    if(cart) {
       return cart.addToCart(item, quantity);
    }

    let rate = item.get('rate');
    let totalAmount = (rate * quantity);
    let totalItem = quantity;
    
    let cartItems = [];
    let cartItem = { _id: item.get('_id'), item, quantity };
    cartItems.push(cartItem);

    cart = {
        client: clientId,
        item: cartItems,
        totalAmount,
        totalItem
    }
   
    return this.create(cart);

}

CartSchema.methods.addToCart = async function(item, quantity = 1) {

    let itemId = item.get('_id');
    let rate = item.get('rate');

    let cartItems = this.get('item');
    let cartItem = cartItems.id(itemId);
    let totalAmount = this.get('totalAmount');
    let totalItem = this.get('totalItem');

    if (!totalAmount) {
        totalAmount = 0;
    }
    
    if (!totalItem) {
        totalItem = 0;
    }

    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cartItems.push({ _id: item.get('_id'), item, quantity});
    }

    totalAmount += (quantity * rate);
    totalItem += quantity;

    this.set('totalAmount', totalAmount);
    this.set('totalItem', totalItem);

    return this.save();
}

CartSchema.methods.removeFromCart = async function(item, quantity = 1) {

    let itemId = item.get('_id');
    let rate = item.get('rate');

    let cartItems = this.get('item');
    let cartItem = cartItems.id(itemId);
    let totalAmount = this.get('totalAmount');
    let totalItem = this.get('totalItem');

    if (!totalAmount) {
        totalAmount = 0;
    }
    
    if (!totalItem) {
        totalItem = 0;
    }

    if (!cartItem) {
        throw new Error('Item not in cart!');
    } else {
        if(cartItem.quantity == 1) {
            cartItem.remove();
        } else {
            cartItem.quantity -= quantity;
        }
    }

    totalAmount -= (quantity * rate);
    totalItem -= quantity;

    this.set('totalAmount', totalAmount);
    this.set('totalItem', totalItem);

    return this.save();
}


let CartModel = mongoose.model('Cart', CartSchema);
module.exports = { CartModel, CartSchema };
