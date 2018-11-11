const cart = require('../controllers/cart');
const resource = require('./resource');

router = resource(cart);
router.post('/add', cart.addToCart.bind(cart));
router.post('/remove', cart.removeFromCart);
router.post('/delete', cart.deleteCart.bind(cart));

module.exports = router;