const { Router } = require('express');
const { authController } = require('../controllers/authController');

const authRouter = new Router();

authRouter.get('/signin', authController.signIn);
authRouter.get('/callback', authController.getToken);
authRouter.get('/signout', authController.signOut);

module.exports = { authRouter };