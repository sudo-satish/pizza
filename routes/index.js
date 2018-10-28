const express = require('express');
const router = express.Router();
const resHndlr = require('../middleware/responseHandler');
const requestValidator = require('../middleware/requestValidator');
const auth = require('../middleware/auth');

router.use(resHndlr);
router.use(requestValidator);

router.use('/ingredient', require('./ingredient'));
router.use('/client', require('./client'));
router.use('/item', auth, require('./item'));
router.use('/lookup', require('./lookup'));

module.exports = router;