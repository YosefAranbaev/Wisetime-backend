const { Router } = require('express');
const { inboxController } = require('../controllers/inboxController');

const inboxRouter = new Router();

inboxRouter.get('/', inboxController.gettasks);
inboxRouter.post('/', inboxController.addInboxtask); 
inboxRouter.delete('/:taskId', inboxController.deleteTask);
module.exports = { inboxRouter };