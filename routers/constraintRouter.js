const { Router } = require('express');
const { constraintsController } = require('../controllers/constraintsController');

const constraintRouter = new Router();

constraintRouter.post('/', constraintsController.addConstraints); 

module.exports = { constraintRouter };