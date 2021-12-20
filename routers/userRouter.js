const { Router } = require('express');
const { usersController } = require('../controllers/usersController');

const userRouter = new Router();

userRouter.post('/:userId/constraints',usersController.addConstraints); 
userRouter.post('/:userId/categories',usersController.addCategories); 

module.exports = { userRouter };