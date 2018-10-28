module.exports = (controller) => {
    const express = require('express');
    const router = express.Router();

    router.get('/', controller.index.bind(controller));
    router.get('/lov', controller.lov.bind(controller));
    router.post('/', controller.create.bind(controller));
    router.get('/:id', controller.show.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.destroy.bind(controller));
    return router;
}