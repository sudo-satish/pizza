const order = require('../controllers/order');
const resource = require('./resource');

router = resource(order);
router.get('/queue/client', order.getOrderQueue.bind(order));
router.put('/:id/complete', order.completeOrder.bind(order));
router.post('/place-order', order.placeOrder.bind(order));

module.exports = router;