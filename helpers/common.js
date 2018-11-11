var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
var encryptor = require('simple-encryptor')(process.env.SECRET);
const _ = require('lodash');

module.exports = () => {

    global._ = _;
    global.encrypt = (password) => encryptor.encrypt(password);
    global.decrypt = (hash) => encryptor.decrypt(hash);

    global.getToken = (obj) => jwt.sign(obj, process.env.SECRET);
    global.verifyToken = (token) => jwt.verify(token, process.env.SECRET);

    // global.getOTP = () => _.random(1000, 9999);
    global.getOTP = () => '0000';
}

