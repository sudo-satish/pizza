const Joi = require('joi');

module.exports = (req, res, next) => {
    req.validate = function(schema) {

        const result = Joi.validate(this.body, schema);
        if(result.error) {
            console.log(result.error);
            res.sendJoiError(result.error);
            return false;
        } else {
            req.JoiValue = result.value;
            return true;
        }
    }
    req.valid = function(schema) {
        const result = Joi.validate(this.body, schema);
        if(result.error) {
            res.sendJoiError(result.error);
            return false;
        } else {
            req.JoiValue = result.value;
            return true;
        }
    }

    next();
}