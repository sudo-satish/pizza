const Resource = require('./resource');
const {CartModel} = require('../models/cart');
const {ItemModel} = require('../models/item');
const Joi = require('joi');


class Cart extends Resource {
    constructor() {
        super();
        this.model = CartModel;
    }

    async index(req, res) {
        try {
            let cart = await this.model.findOne({ client: req.auth.user.get('_id') });
            if(!cart) {
                throw new Error('Cart not found!');
            }

            res.success(cart);
        } catch (error) {
            res.badRequest(error);
        }
    }

    async addToCart(req, res) {
        try {
            let item = await ItemModel.findById(req.body.item).exec();
            if (!item) throw new Error('Item not found');

            let client = req.auth.user;
            let quantity = req.body.quantity || 1;

            let cart = await CartModel.addToCart(client, item, quantity);
            res.success(cart);
        } catch (error) {
            res.badRequest(error);
        }
    }

    async removeFromCart(req, res) {
        try {
            let item = await ItemModel.findById(req.body.item).exec();
            if (!item) throw new Error('Item not found');

            let client = req.auth.user;
            let quantity = req.body.quantity || 1;
            let cart = await CartModel.findOne({client: client._id});
            if (!cart) throw new Error('Cart Not found!');


            cart = await cart.removeFromCart(item, quantity);
            res.success(cart);
        } catch (error) {
            res.badRequest(error);
        }
    }

    async deleteCart(req, res) {
        try {
            let clientId = req.auth.user.get('_id');

            let cart = await this.model.findOne({ client: req.auth.user.get('_id') });
            if (!cart) {
                throw new Error('Cart not found!');
            }
            
            await CartModel.deleteOne({ client: clientId });

           res.success({}, 'Deleted successfully!');
        } catch (error) {
            res.badRequest(error);
        }
    }
}

module.exports = new Cart();