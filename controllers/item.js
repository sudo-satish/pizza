const Resource = require('./resource');
const {ItemModel} = require('../models/item');
const LookupModel = require('../models/lookup');
const Joi = require('joi');
const { SalesDetailModel } = require('../models/SalesDetail');

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

    async create(req, res) {
        req.body.client = req.auth.user.get('_id');
        res.status(203).success(await this.model.create(req.body));
    }


    async lov(req, res) {
        return res.success(await this.model.lov());
    }

    async frequentlySold(req, res) {
        let client = req.auth.user.get('_id');
        let where = {
            client,
        };
        
        let itemIds = await SalesDetailModel.find(where).select('itemId').sort({ totalQuantity: -1 }).limit(10).lean(true);
        itemIds = itemIds.map(i => i.itemId);
        return res.success(await this.model.find({_id: {$in: itemIds}}), 'Frequently Sold Yesterday');
    }
}

module.exports = new Item();