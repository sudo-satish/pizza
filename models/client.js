var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { isEmail } = require('validator');
var {OrderModel} = require('./order');

var clientSchema = new Schema({
    name: {type: String, required: 'Name is required'},
    profile: { type: String, default: 'http://res.cloudinary.com/doqzgok2j/image/upload/v1541927228/client/profile/admin_1246391.png'},
    phone: { type: String, required: 'Phone is required', unique: true,},
    password: {type: String, required: 'Password is required'},
    token: {type: String},
    otp: String,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [isEmail, 'Invalid email']
    }
}, {
    timestamps: true,
    collection: 'Client',
    strict: true,
    versionKey: false
});

clientSchema.methods.saveToken = async function() {
    let payload = {
        _id: this.get('_id').toString(),
        type: 'Client'
    };

    let token = getToken(payload);
    this.set('token', token);
    return await this.save();
}

clientSchema.methods.getCart = async function() {
    let where = {
        client: this.get('_id')
    };
    return this.model('Cart').findOne(where).exec();
}

clientSchema.methods.placeOrder = async function (phone) {
    return OrderModel.placeOrder(this, await this.getCart(), phone);
}

module.exports = mongoose.model('Client', clientSchema);

