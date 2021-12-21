const User = require('../models/users');

exports.usersController = {
    addUser(req, res) {
        const { body } = req;

        const newUser = new User(body);

        newUser.save().then(result => {
            if (result) {
                res.status(200).json({"success": "User added successfully"});
            } else {
                res.status(500).json({"error": "Error adding a user"});
            }
        });
    }
}