const User = require('../models/users');

exports.categoriesController = {
    addCategories(req, res) {
        res.status(200).send('add categories');
    }
}