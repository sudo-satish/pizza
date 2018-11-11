
const Resource = require('./resource');
const ClientModel = require('../models/client');
const {OrderModel} = require('../models/order');
const {SalesDetailModel} = require('../models/SalesDetail');
const Joi = require('joi');

class Client extends Resource {
    
    constructor() {
        super();
        this.model = ClientModel;
    }
    async create(req, res) {
        try {

            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required(),
                password: Joi.string(),
                name: Joi.string().required()
            })

            if (!req.valid(schema)) return;

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

    async placeOrder(req, res) {
        try {
            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required()
            });

            if (!req.valid(schema)) return;
            
            let order = await req.auth.user.placeOrder(req.body.phone);
            res.success(order);
        } catch (error) {
            res.badRequest(error);
        }
    }

    async getOrderQueue(req, res) {
        try {
            let clientId = req.auth.user.get('_id');
            res.success(await OrderModel.getOrderQueue(clientId));
        } catch (error) {
            res.badRequest(error);
        }
    }

    /**
     * Send reset otp.
     */
    async forgetPassword(req, res) {
        try {
            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required()
            });

            if (!req.valid(schema)) return;

            let client = await this.model.findOneAndUpdate({ phone: req.body.phone }, { otp: getOTP() }, { new: true });
            if (!client) throw new Error('Phone not registered!');
            res.success({}, 'Otp sent to mobile.')
        } catch (error) {
            res.badRequest(error);
        }
    }

    /**
     * Send otp to mobile.
     */
    async sendOtp(req, res) {
        try {
            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required()
            });

            if (!req.valid(schema)) return;

            let client = await this.model.findOneAndUpdate({ phone: req.body.phone }, { otp: getOTP() }, { new: true });
            if (!client) throw new Error('Phone not registered!');
            res.success({}, 'Otp sent to mobile.')
        } catch (error) {
            res.badRequest(error);
        }
    }

    /**
     * OTP login
     */
    async otpLogin(req, res) {
        try {
            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required(),
                otp: Joi.string().required()
            });

            
            let client = await this.model.findOneAndUpdate(req.body, {otp: ''}, {new : true}).exec();
            if (!client) {
                res.unauthorized();
                return;
            }

            client = await client.saveToken();
            res.success(client);

        } catch (error) {
            res.badRequest(error);
        }
    }

    /**
     * rest password using otp sent to phone.
     */
    async resetPassword(req, res) {
        try {
            const schema = Joi.object().keys({
                phone: Joi.string().length(10).required(),
                otp: Joi.string().required(),
                password: Joi.string().required()
            });

            if (!req.valid(schema)) return;

            let credentials = req.JoiValue;
            let password = req.body.password;
            delete credentials.password;

            let client = await this.model.findOneAndUpdate(credentials, { password: encrypt(req.body.password), otp: ''}, {new: true}).exec();
            if (!client) {
                res.unauthorized();
                return;
            }

            client = await client.saveToken();
            res.success(client, 'Password changed successfully!');
        } catch (error) {
            res.badRequest(error);
        }
    }

    /**
     * Update profile
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async profile(req, res) {
        try {
            if(req.file) {
                console.log(req.file);
                let cloudResult = await cloudinary.v2.uploader.upload(req.file.path, { 
                    public_id: `client/profile/${req.file.filename}`,
                    crop: 'limit',
                    width: 2000,
                    height: 2000,
                    eager: [    
                        {
                            width: 200, height: 200, crop: 'c_thumb', gravity: 'g_face',
                            radius: 20, effect: 'sepia'
                        },
                        { width: 100, height: 150, crop: 'fit', format: 'png' }],
                    tags: ['special', 'for_homepage']
                });

                console.log(cloudResult);
                
                req.body.profile = cloudResult.eager[0].url;
            }

            let body = req.body;
            console.log(body);
            
            for (const key in body) {
                // if (body.hasOwnProperty(key)) {
                    const value = body[key];
                    req.auth.user.set(key, value);
                // }
            }

            await req.auth.user.save();
            res.send(req.auth.user);
        } catch (error) {
            res.badRequest(error);
        }
    }

    async dashboard(req, res) {
        let where = {
            client: req.auth.user.get('_id')
        };

        let totalSales = await SalesDetailModel.find(where).select('totalAmount totalQuantity itemId createdAt').populate({path: 'itemId', select: 'name'}).lean(true);
        let monthlySales = await OrderModel.getMonthSale(where);
        let userSales = await OrderModel.getUserSale(where);

        let totalSalesAmount = totalSales.reduce((prev, cur) => prev += cur.totalAmount, 0);
        let totalSalesQuantity = totalSales.reduce((prev, cur) => prev += cur.totalQuantity, 0);

        res.success({ totalSalesAmount, totalSalesQuantity, monthlySales, totalSales, userSales});
    }

}

module.exports = new Client();