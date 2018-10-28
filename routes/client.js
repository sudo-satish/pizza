const client = require('../controllers/client');
const resource = require('./resource');
const auth = require('../middleware/auth');

router = resource(client);
router.post('/login', client.login.bind(client));
router.post('/logout', auth, client.logout.bind(client));

module.exports = router;
