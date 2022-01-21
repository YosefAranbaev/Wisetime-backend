const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/users');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET, {
        expiresIn: 24*60*60
    });
};

exports.authController = {
    async signup(req, res) {
        const { body } = req;

        const user = await User.findOne({ email: body.email });
        if(user) {
            res.status(400).json({"error": "User with this email already exists"});
        } else {
            const newUser = new User({
                'name': body.username,
                'email': body.email,
                'password': bcrypt.hashSync(body.password, 8)
            });
    
            newUser.save().then(result => {
                if (result) {
                    res.status(200).send({
                        id: result.id,
                        username: body.username,
                        email: body.email,
                        accessToken: generateToken(result.id)
                    });
                } else {
                    res.status(500).json({"error": "Error adding a user"});
                }
            });
        }
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
                    res.status(200).send({
                        id: user._id,
                        username: user.name,
                        email: user.email,
                        accessToken: generateToken(user._id)
                    });
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ 'error': 'Error while getting the user' })
            });
    },
    signout(req, res) {

    }
}