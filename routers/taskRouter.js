const { Router } = require('express');
const { tasksController } = require('../controllers/tasksController');

const taskRouter = new Router();

taskRouter.post('/',tasksController.addTask); 
taskRouter.get('/', tasksController.getTasks); 
// outcomesRouter.delete('/:id', outcomesController.deleteFlight); //

module.exports = { taskRouter };