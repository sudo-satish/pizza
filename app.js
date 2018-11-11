var Promise = require("bluebird");
global.Promise = Promise;

require('dotenv').config();
require('./lib/index')();
require('./helpers/index')();
require('./services/index')();
require('./cron/index')();

const express = require('express');
const http = require('http');
const app = express();
const router = require('./routes/index');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary');

global.sendSms = require('./services/twillio').sendSms;

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
global.cloudinary = cloudinary;

try {
    app.use(router);
    app.use('', (error, req, res, next) => {
        res.send(error.message);
    })

    let port = process.env.PORT || 3000;
    let server = http.createServer(app).listen(port);

    server.on('connection', function (x) { console.log('On Connection '); });
    server.on('listening', (x) => { console.log('listening on port ', port); });
} catch (error) {
    console.log('default error => ');
    console.error(error);
}


