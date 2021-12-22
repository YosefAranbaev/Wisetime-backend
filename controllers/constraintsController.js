const User = require('../models/users');

exports.constraintsController = {
    addConstraints(req, res) {
        const query = { '_id' : req.userId };
        const newData = {
            'constraints.sunday':   `${ req.body.sunday_start_time }-${ req.body.sunday_end_time}`,
            'constraints.monday':   `${ req.body.monday_start_time }-${ req.body.monday_end_time}`,
            'constraints.tuesday':  `${ req.body.tuesday_start_time }-${ req.body.tuesday_end_time}`,
            'constraints.wednesday':`${ req.body.wednesday_start_time }-${ req.body.wednesday_end_time}`,
            'constraints.thursday': `${ req.body.thursday_start_time }-${ req.body.thursday_end_time}`,
            'constraints.friday':   `${ req.body.friday_start_time }-${ req.body.friday_end_time}`,
            'constraints.saturday': `${ req.body.saturday_start_time }-${ req.body.saturday_end_time}`
        };

        User.findOneAndUpdate(query, newData, {upsert: true}, (err, doc) => {
            if(err) {
                res.status(500).json({'error': 'Error while adding constraints'});
            } else {
                res.status(200).json({'success': 'Constraints added successfully'});
            }
        }) 
    }
}