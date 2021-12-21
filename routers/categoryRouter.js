const { Router } = require('express');
const { categoriesController } = require('../controllers/categoriesController');

const categoryRouter = new Router();

categoryRouter.post('/', categoriesController.addCategories); 

module.exports = { categoryRouter };