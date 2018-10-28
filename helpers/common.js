var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
var encryptor = require('simple-encryptor')(process.env.SECRET);

// var data = [{ id: 1 }, { id: 2 }]

// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123');

// // Decrypt
// var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

// console.log(decryptedData);

module.exports = () => {
    // global.encrypt = (password) => CryptoJS.AES.encrypt(password, process.env.SECRET).toString();
    // global.decrypt = (hash) => CryptoJS.AES.decrypt(hash, process.env.SECRET).toString();

    global.encrypt = (password) => encryptor.encrypt(password);
    global.decrypt = (hash) => encryptor.decrypt(hash);

    global.getToken = (obj) => jwt.sign(obj, process.env.SECRET);
    global.verifyToken = (token) => jwt.verify(token, process.env.SECRET);
}

