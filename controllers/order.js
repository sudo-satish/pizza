const Resource = require('./resource');
const { OrderModel } = require('../models/order');
const Joi = require('joi');

class Order extends Resource {
    constructor() {
        super();
        this.model = OrderModel;
    }

    async update(req, res) {
        let orderId = req.params.id;
        let order = await OrderModel.findById(orderId);
        order.set('status', 'Completed');

        res.success(await order.save());
    }

    async getOrderQueue(req, res) {
        try {
            let clientId = req.auth.user.get('_id');
            res.success(await OrderModel.getOrderQueue(clientId));
        } catch (error) {
            res.badRequest(error);
        }
    }

    async completeOrder(req, res) {
        try {
            let orderId = req.params.id;
            let order = await OrderModel.findByIdAndUpdate(orderId, { status: 'Completed' }, { new: true });
            res.success(order, 'Order complete successfully!');

        } catch (error) {
            res.badRequest(error);
        }
    }

    async placeOrder(req, res) {
        try {
            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required()
            });

            if (!req.valid(schema)) return;

            let order = await req.auth.user.placeOrder(req.body.phone);

            
            // 
            res.success(order);

            let body = `${req.auth.user.name} : Order Placed successfully | Order No #${order.orderNumber}`;
            order.cart.item.forEach(i => {
                body += ` | ${i.item.name}`;
            })

            sendSms('+91' + req.body.phone, body).then(result => {
                console.log(' SMS res => ', result);
            }).catch(e => {
                console.error(' SMS err => ', e);
            })

        } catch (error) {
            res.badRequest(error);
        }
    }
}

module.exports = new Order();