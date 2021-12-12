const { Router } = require('express');
const { calendarController } = require('../controllers/calendarController');

const calendarRouter = new Router();

calendarRouter.get('/', calendarController.getEvents);
calendarRouter.get('/new', calendarController.getCreateEvent);
calendarRouter.post('/new', calendarController.createEvent);

module.exports = { calendarRouter };