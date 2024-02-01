// imports
const taskController = require('../controllers/taskController');
// router obj
const taskRoutes = require('express').Router();


// routes
taskRoutes.get('/', taskController.getAll);


module.exports = taskRoutes;