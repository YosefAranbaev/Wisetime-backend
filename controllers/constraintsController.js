const User = require('../models/users');

exports.constraintsController = {
    addConstraints(req, res) {
        const query = { '_id' : req.userId };
        const { body } = req;

        const newData = {
            'constraints.sunday': body.sunday,
            'constraints.monday': body.monday,
            'constraints.tuesday': body.tuesday,
            'constraints.wednesday': body.wednesday,
            'constraints.thursday': body.thursday,
            'constraints.friday': body.friday,   
            'constraints.saturday': body.saturday
        };

        User.findOneAndUpdate(query, newData, {upsert: true}, (err, doc) => {
            if(err) {
                res.status(500).json({'error': 'Error while adding constraints'});
            } else {
                res.status(200).json({'success': 'Constraints added successfully'});
            }
        }) 
    },
    getConstraints(req, res) {
        const query = { '_id' : req.userId };
        User.findOne(query)
            .then(user => {
                res.status(200).json(user.constraints);
            })
            .catch(err => res.status(500).json({'error': 'error while getting user'}));
    }
}