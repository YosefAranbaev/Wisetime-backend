const Inbox = require('../models/inbox');

exports.inboxController = {
    addInboxtask(req, res) {
        // const query = { '_id' : req.userId };
        const { body } = req;

        // const newData = {
        //     'name': body.name,
        //     'id': body.id,
        //     'email': body.email,
        //     'duration_time': body.duration_time,
        //     'id_of_side_user': body.id_of_side_user,
        //     'name_of_side_user': body.name_of_side_user,   
        //     'color': body.color
        // };
        const newInboxtask = new Inbox(body);
        newInboxtask.save().then(result => {
            if (result) {
                res.status(200).json({"success": "Inbox task added successfully"});
            } else {
                res.status(500).json({"error": "Error adding a user"});
            }
        })
        .catch(err => res.status(500).json({'error': 'error while posting user'+err}));
    },
    gettasks(req, res) {
        const query = { '_id' : req.userId };
        Inbox.find()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => res.status(500).json({'error': 'error while getting user'}));
    }
}