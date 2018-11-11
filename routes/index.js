const express = require('express');
const router = express.Router();
const resHndlr = require('../middleware/responseHandler');
const requestValidator = require('../middleware/requestValidator');
const auth = require('../middleware/auth');
const resource = require('./resource');

router.use(resHndlr);
router.use(requestValidator);
router.get('/', (req, res) => { res.send(`<h1>Welcome to ${process.env.APP_NAME}</h1>`)})
router.use('/ingredient', require('./ingredient'));
router.use('/client', require('./client'));
router.use('/item', auth, require('./item'));
router.use('/lookup', auth, require('./lookup'));
router.use('/cart', auth, require('./cart'));
router.use('/order', auth, require('./order'));

// ================= Translation Routes ===================
var localeC = require('../controllers/locale');
locale = resource(localeC);
router.use('/locale', locale);

module.exports = router;