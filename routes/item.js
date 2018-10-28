const item = require('../controllers/item');
const resource = require('./resource');
const auth = require('../middleware/auth');
// const express = require('express');
// const router = express.Router();

// router.use()
router = resource(item);

module.exports = router;