const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/users');

exports.authController = {
    signup(req, res) {
        const { body } = req;

        const newUser = new User({
            'name': body.name,
            'email': body.email,
            'password': bcrypt.hashSync(body.password, 8)
        });

        newUser.save().then(result => {
            if (result) {
                res.status(200).json({"success": "User added successfully"});
            } else {
                res.status(500).json({"error": "Error adding a user"});
            }
        });
    },
    signin(req, res) {
        const { body } = req;

        User.findOne({ email: body.email })
            .then(user => {
                const passwordIsValid = bcrypt.compareSync(
                    body.password,
                    user.password
                );
        
                if (!passwordIsValid) {
                    return res.status(401).json({
                      accessToken: null,
                      message: "Invalid Password!"
                    });
                } else {
                    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
                        expiresIn: 24*60*60
                    });
        
                    res.status(200).send({
                        id: user._id,
                        username: user.name,
                        email: user.email,
                        accessToken: token
                    });
                }
            })
            .catch(err => res.status(500).json({ 'error': 'Error while getting the user' }));
    }
}