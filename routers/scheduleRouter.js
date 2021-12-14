const { Router } = require('express');
const { scheduleController } = require('../controllers/scheduleController');

const scheduleRouter = new Router();

scheduleRouter.get('/', scheduleController.getSchedule);

module.exports = { scheduleRouter };