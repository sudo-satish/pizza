const Resource = require('./resource');
const ItemModel = require('../models/item');
const LookupModel = require('../models/lookup');
const Joi = require('joi');


class Item extends Resource {
    constructor() {
        super();
        this.model = ItemModel;
    }

    async index(req, res) {

        let where = {};
        if (req.query.type) {
            let typeId = await LookupModel.getTypeId({ translation_type: 'ITEM_TYPE', code: req.query.type });
            where.type = typeId;
        }

        console.log(where);
        
        res.success(await this.model.getDetail(where));
    }


    async lov(req, res) {
        return res.success(await this.model.lov());
    }
}

module.exports = new Item();