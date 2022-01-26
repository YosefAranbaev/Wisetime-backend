const { Router } = require('express');
const { constraintsController } = require('../controllers/constraintsController');

const constraintRouter = new Router();

constraintRouter.post('/', constraintsController.addConstraints); 
constraintRouter.get('/', constraintsController.getConstraints);

module.exports = { constraintRouter };