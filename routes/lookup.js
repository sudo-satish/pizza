const lookup = require('../controllers/lookup');
const resource = require('./resource');
const auth = require('../middleware/auth');

router = resource(lookup);

module.exports = router;