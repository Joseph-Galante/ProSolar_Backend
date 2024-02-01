// imports
const userController = require('../controllers/userController');
// router obj
const userRoutes = require('express').Router();


// routes
userRoutes.post('/signup', userController.signup);
userRoutes.post('/login', userController.login);
userRoutes.get('/profile', userController.profile);
userRoutes.put('/profile', userController.update);
userRoutes.get('/verify', userController.verify);


module.exports = userRoutes;