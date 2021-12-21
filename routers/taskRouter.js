const { Router } = require('express');
const { tasksController } = require('../controllers/tasksController');

const taskRouter = new Router();

taskRouter.get('/', tasksController.getTasks); 
taskRouter.get('/:taskId', tasksController.getTask);
taskRouter.post('/',tasksController.addTask); 
taskRouter.put('/:taskId', tasksController.updateTask);
taskRouter.delete('/:taskId', tasksController.deleteTask);

module.exports = { taskRouter };