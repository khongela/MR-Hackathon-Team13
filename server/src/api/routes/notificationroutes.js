const express = require('express');
const notificationController = require('../controllers/notificationController');
const router = express.Router();

// Public routes
router.get('/', notificationController.getAllNotifications);
router.get('/status/:status', notificationController.getNotificationsByStatus);
router.post('/post-notification',notificationController.postNewNotification);

module.exports = router; 
