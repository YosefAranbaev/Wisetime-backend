const { Router } = require('express');
const { indexController } = require('../controllers/indexController');

const indexRouter = new Router();

indexRouter.get('/', indexController.getHomepage);

module.exports = { indexRouter };