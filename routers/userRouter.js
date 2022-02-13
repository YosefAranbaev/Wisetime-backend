const { Router } = require('express');
const { usersController } = require('../controllers/usersController');

const userRouter = new Router();

userRouter.post('/', usersController.addUser); 
userRouter.get('/:userEmail', usersController.getUsers); 

module.exports = { userRouter };