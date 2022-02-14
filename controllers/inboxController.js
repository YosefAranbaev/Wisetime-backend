const Inbox = require('../models/inbox');

exports.inboxController = {
    addInboxtask(req, res) {
        const { body } = req;
        console.log(body)
        const newInboxtask = new Inbox(body);
        newInboxtask.save().then(result => {
            if (result) {
                res.status(200).json({ "success": "Inbox task added successfully" });
            } else {
                res.status(500).json({ "error": "Error adding a user" });
            }
        })
            .catch(err => res.status(500).json({ 'error': 'error while posting user' + err }));
    },
    gettasks(req, res) {
        Inbox.find()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => res.status(500).json({ 'error': 'error while getting user' }));
    },
    deleteTask(req, res) {
        Inbox.deleteOne({ _id: req.params.taskId })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => res.status(500).json({ "error": "Error deleting a task" }))
    },
}