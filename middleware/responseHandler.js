module.exports = (req, res, next) => {

    res.badRequest = function(error) {
        this.defaultError(error);
    }

    res.error = function(error) {
        this.send({error: {message: _$(error.message) }})
    }

    res.defaultError = function (error) {
        if(error['code']) {
            // this.status(401).send({ error: { message: 'Duplicate value!' } });
            this.status(401).send({ error: { message: _$('Duplicate value!') } });
        } else if(error['errors']) {
            this.mongooseValidation(error);
        } else {
            this.status(400).send({error: {message: _$(error.message)}});
        }
    }

    res.mongooseValidation = function (error) {
        let errors = error['errors'];
        let fieldError = {};
        for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
                const value = errors[key];
                fieldError[key] = value.message;
            }
        }

        this.status(401).json({error: { field: fieldError, message: _$('Field validation failed!') }});

    }

    res.sendJoiError = function(error) {
        let fieldObj = {};
        let detail = error.details[0];
        let message = detail.message;
        let key = detail.path[0];
        fieldObj[key] = message;
    
        this.status(403).send({ error: { message: _$('Invalid request!'), field: fieldObj}})
    }

    res.success = function(data, message = 'Success') {
        this.json({ message: _$(message), data});
    }

    res.unauthorized = function() {
        this.status(403).json({error: {message: _$('Unauthorized access!')}});
    }

    next();
}