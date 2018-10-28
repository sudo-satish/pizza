const ingredient = require('../controllers/ingredient');
const resource = require('./resource');
const auth = require('../middleware/auth');

router = resource(ingredient);

module.exports = router;