const User = require('../models/users');

exports.constraintsController = {
    addConstraints(req, res) {
        res.status(200).send('add constraints');
    }
}