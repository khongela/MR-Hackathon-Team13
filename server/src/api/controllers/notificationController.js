const notificationService = require('../services/notificationService');

class notificationController {
    async getAllNotifications(req, res, next) {
        try {          
            const notifications = await notificationService.getAllNotifications();

            if (notifications) {
                res.json({
                    success: true,
                    data: notifications
                });
            }   

        } catch (error) {
            next(error);
        }
    }

    async getNotificationsByStatus(req, res, next) {
        try {
            const status = req.params.status;

            const notifications = await notificationService.getNotificationsByStatus(status);

            res.json({
                success: true,
                data: notifications
            });
                
        } catch (error) {
            next(error);
        }
    }
    
    async postNewNotification(req, res, next) {
        try {
            
            const {status,title} = req.body;
            const notifcation = await notificationService.postNewNotification(status,title);

            res.json({
                success: true,
                data: notifcation
            });
                
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new notificationController();