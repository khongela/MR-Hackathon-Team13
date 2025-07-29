const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Public routes
router.get('/', userController.getAllUsers);
router.get('/id/:id', userController.getUserById);

router.patch('/update-name/:id/:name',userController.patchUserName);
router.patch('/update-email/:id/:email',userController.patchUserEmail);
router.patch('/update-password/:id/:password',userController.patchUserPassword);
router.patch('/update-address/:id/:address',userController.patchUserAddress);

router.post('/post-user',userController.postNewUser);

module.exports = router; 
