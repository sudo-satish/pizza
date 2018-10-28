
const Resource = require('./resource');
const ClientModel = require('../models/client');
const Joi = require('joi');

class Client extends Resource {
    
    constructor() {
        super();
        this.model = ClientModel;
    }
    async create(req, res) {
        try {
            let client = req.body;
            console.log(client);
            
            client.password = encrypt(req.body.password);

            console.log(client);
            
            client = await ClientModel.create(client);
            res.success(client);
        } catch (error) {
            res.defaultError(error);
        }
    }

    async login(req, res) {
        
        try {
            
            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required(),
                password: Joi.string().required()
            });

            if (!req.valid(schema)) return;

            let credentials = req.JoiValue;
            let password = req.body.password;
            delete credentials.password;
            
            let client = await this.model.findOne(credentials).exec();
            if (!client) {
                res.unauthorized();
                return;
            }

            let savedPassword = decrypt(client.password);
            if (password !== savedPassword) {
                res.unauthorized();
                return;
            }
            
            client = await client.saveToken();
            res.success(client);

        } catch (error) {
            console.log(error);
            res.send('asdff');
            
        }
        
    }

    async logout(req, res) {
        // req.headers.authorization
        let user = req.auth.user;
        user.set('token', '');

        await user.save();
        
        res.success({}, 'Logged out successfully!');
    }

}

module.exports = new Client();