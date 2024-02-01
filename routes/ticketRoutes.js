// imports
const ticketController = require('../controllers/ticketController');
// router obj
const ticketRoutes = require('express').Router();


// routes
ticketRoutes.post('/submit', ticketController.submit);
ticketRoutes.get('/', ticketController.getAll);
ticketRoutes.get('/user', ticketController.getMine);
ticketRoutes.post('/:id/assign', ticketController.assign);
ticketRoutes.put('/:id/complete', ticketController.complete);


module.exports = ticketRoutes;