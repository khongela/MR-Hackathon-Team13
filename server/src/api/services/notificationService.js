const data = require('../../config/database');

class notificationService {
    async getAllNotifications() {
        const query = 'SELECT * FROM "Notification" ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    };

    async getNotificationsByStatus(status) {
        const query = {
            text: 'SELECT * FROM "Notification" WHERE status = $1',
            values: [status]
        };
        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
    };

    async postNewNotification(status,title) {
        const query = {
            text: 'INSERT INTO "Notification" (status,title) VALUES ($1,$2)',
            values: [status,title]
        };

        try {
            const result = await data.query(query);
            return result.rows;
        } catch (error) {
            throw new Error('Error inserting notification: ' + error.message);
        }
    };

};

module.exports = new notificationService();