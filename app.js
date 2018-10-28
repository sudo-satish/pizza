var Promise = require("bluebird");
global.Promise = Promise;

require('dotenv').config();
require('./helpers/index')();
require('./services/index')();

const express = require('express');
const http = require('http');
const app = express();
const router = require('./routes/index');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

try {
    app.use(router);
    app.use('', (error, req, res, next) => {
        res.send(error.message);
    })

    let port = process.ENV || 3000;
    let server = http.createServer(app).listen(port);

    server.on('connection', function (x) { console.log('On Connection '); });
    server.on('listening', (x) => { console.log('listening on port ', port); });
} catch (error) {
    console.log('default error => ');
    console.error(error);
}


