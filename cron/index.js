var CronJob = require('cron').CronJob;
var moment = require('moment');
var { OrderModel } = require('../models/order');
var { SalesDetailModel } = require('../models/SalesDetail');

module.exports = () => {
    setDailySalesDetail();
}

async function setDailySalesDetail() {

    const job = new CronJob('0 1 * * *', setDetail);

    job.start();

    // setDetail();

    async function setDetail() { // '0 1 * * *' at 1 a.m.

        let yesterdayOrders = await OrderModel.getYesterdayOrder();
        yesterdayOrders = JSON.parse(JSON.stringify(yesterdayOrders));

        var itemMap = {};

        yesterdayOrders.forEach(element => {
            element.cart.item.forEach(item => {

                let quantity = item.quantity;
                let amount = item.item.rate * quantity;
                let itemId = item._id;

                if (!itemMap.itemId) {
                    let daily = {
                        quantity,
                        amount,
                        date: element.cart.createdAt
                    };

                    itemMap[itemId] = {};
                    itemMap[itemId]['totalQuantity'] = quantity;
                    itemMap[itemId]['totalAmount'] = amount;
                    itemMap[itemId]['daily'] = daily;
                    itemMap[itemId]['client'] = element.cart.client;
                } else {
                    itemMap[itemId]['totalQuantity'] += quantity;
                    itemMap[itemId]['totalAmount'] += amount;
                    itemMap[itemId]['daily'].quantity += quantity;
                    itemMap[itemId]['daily'].amount += amount;
                }


            })
        });

        for (const key in itemMap) {
            if (itemMap.hasOwnProperty(key)) {
                const value = itemMap[key];
                let salesDetail = SalesDetailModel.updateOne({ itemId: key }, { $addToSet: { daily: value.daily }, $inc: { totalQuantity: value.totalQuantity, totalAmount: value.totalAmount }, client: value.client }, { new: true, upsert: true });
                salesDetail.then(d => {
                    console.log(d);
                }).catch(e => {
                    console.log(e);
                })
            }
        }
    };
}