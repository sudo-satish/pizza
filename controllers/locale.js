const Resource = require('./resource');

class Item extends Resource {
    constructor() {
        super();
    }

    async index(req, res) {
        res.success(require('../lib/locale.json'));
    }

    async create(req, res) {
        saveTranslation(req.body.lang, req.body.key, req.body.value);
        res.status(203).success(require('../lib/locale.json')[req.body.key]);
    }

    async show(req, res) {
        res.success(require('../lib/locale.json')[req.params.id]);
    }
}

module.exports = new Item();