const item = require('../controllers/item');
const resource = require('./resource');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
// const multer = require('multer');

router.get('/frequently-sold', item.frequentlySold.bind(item));
router.use(resource(item));

module.exports = router;