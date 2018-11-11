
const Controller = require("./controller");

class Resource extends Controller {

    constructor() {
        super();
        this.model;
    }

    async index(req, res) {

        if(this.model) {
            res.success(await this.model.find());
        } else {
            res.send('index');
        }
    }
    async lov(req, res) {

        res.success({});
    }

    async create(req, res) {
        if(this.model) {
            res.status(203).success(await this.model.create(req.body));
        } else {
            res.send('create => '+ req.body);
        }
    }

    async show(req, res) {
        if (this.model) {
            res.success(await this.model.findById(req.params.id));
        } else {
            res.send('show => '+ req.params.id);
        }
    }

    async update(req, res) {

        if (this.model) {
            res.success(await this.model.findByIdAndUpdate(req.params.id, req.body, {new: true}));
        } else {
            res.send('update => '+ req.params.id);
        } 

    }
    async destroy(req, res) {
        try {
            if (this.model) {
                let order = await this.model.findByIdAndDelete(req.params.id);
                if (!order) {
                    throw new Error('Not found to delete!');
                }
                res.success(order, 'Deleted successfully!');
            } else {
                res.send('delete => ' + req.params.id);
            }
        } catch (error) {
            res.status(404).error(error);
        }
    }
}

module.exports = Resource;