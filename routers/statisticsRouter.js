const { Router } = require('express');
const { statisticsController } = require('../controllers/statisticsController');

const statisticsRouter = new Router();

statisticsRouter.get('/chart', statisticsController.getChart);
statisticsRouter.get('/gauge', statisticsController.getGauge);  

module.exports = { statisticsRouter };