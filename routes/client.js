const client = require('../controllers/client');
const resource = require('./resource');
const auth = require('../middleware/auth');
const Router = require('express').Router();
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'-' +file.originalname)
    }
})

var upload = multer({ storage: storage });

Router.get('/dashboard', auth, client.dashboard.bind(client));
router = resource(client);
router.post('/login', client.login.bind(client));

router.post('/logout', auth, client.logout.bind(client));
router.post('/place-order', auth, client.placeOrder);
router.get('/order/queue', auth, client.getOrderQueue);
router.post('/forget-password', client.forgetPassword.bind(client));
router.post('/reset-password', client.resetPassword.bind(client));
router.post('/otp-login', client.otpLogin.bind(client));
router.post('/send-otp', client.sendOtp.bind(client));
router.post('/profile', auth, upload.single('profile'), client.profile.bind(client));
Router.use(router);

module.exports = Router;
