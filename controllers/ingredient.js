const Resource = require('./resource');
const IngredientModel = require('../models/ingredient');
const Joi = require('joi');


class Ingredient extends Resource {
    constructor() {
        super();
        this.model = IngredientModel;
    }
}

module.exports = new Ingredient();