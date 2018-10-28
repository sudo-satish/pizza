const ClientModel = require('../models/client');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.unauthorized();
        return;
    }

    try {
        let token = req.headers.authorization.split(' ')[1];
        payload = verifyToken(token);
        let type = payload.type;

        if(type == 'Client') {
            let id = payload._id;
            req.auth = {};
            req.auth.user = await ClientModel.findById(id);
        }

        next();
    } catch (error) {
        res.unauthorized();
    }
}