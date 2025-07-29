const data = require('../../config/database');

class MonitoredDestinationService {
    async getAll() {
        const query = 'SELECT * FROM "MonitoredDestination" ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async getById(id) {
        const query = {
            text: 'SELECT * FROM "MonitoredDestination" WHERE id = $1',
            values: [id]
        };
        const result = await data.query(query);
        return result.rows[0] || null;
    }

    async create(location, riskLevel, lastChecked) {
        const query = {
            text: 'INSERT INTO "MonitoredDestination" (location, riskLevel, lastChecked) VALUES ($1, $2, $3) RETURNING *',
            values: [location, riskLevel, lastChecked]
        };

        const result = await data.query(query);
        return result.rows[0];
    }

    async update(id, location, riskLevel, lastChecked) {
        const query = {
            text: 'UPDATE "MonitoredDestination" SET location = $1, riskLevel = $2, lastChecked = $3 WHERE id = $4 RETURNING *',
            values: [location, riskLevel, lastChecked, id]
        };

        const result = await data.query(query);
        return result.rows[0];
    }

    async delete(id) {
        const query = {
            text: 'DELETE FROM "MonitoredDestination" WHERE id = $1 RETURNING *',
            values: [id]
        };

        const result = await data.query(query);
        return result.rows[0];
    }
}

module.exports = new MonitoredDestinationService();
