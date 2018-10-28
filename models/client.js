var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { isEmail } = require('validator');

var clientSchema = new Schema({
    name: {type: String, required: 'Name is required'},
    phone: { type: String, required: 'Phone is required', unique: true,},
    password: {type: String, required: 'Password is required'},
    token: {type: String},
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

module.exports = mongoose.model('Client', clientSchema);

