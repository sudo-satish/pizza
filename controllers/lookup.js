const Resource = require('./resource');
const LookupModel = require('../models/lookup');
const Joi = require('joi');


class Lookup extends Resource {
    constructor() {
        super();
        this.model = LookupModel;
    }
}

module.exports = new Lookup();