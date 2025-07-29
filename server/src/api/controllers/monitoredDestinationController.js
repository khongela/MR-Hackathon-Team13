const monitoredService = require('../services/monitoredDestinationService');

class MonitoredDestinationController {
    async getAll(req, res, next) {
        try {
            const data = await monitoredService.getAll();
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const data = await monitoredService.getById(id);

            if (!data) {
                return res.status(404).json({ success: false, message: 'Not found' });
            }

            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { location, riskLevel, lastChecked } = req.body;
            const newItem = await monitoredService.create(location, riskLevel, lastChecked);
            res.status(201).json({ success: true, data: newItem });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { location, riskLevel, lastChecked } = req.body;

            const updatedItem = await monitoredService.update(id, location, riskLevel, lastChecked);

            if (!updatedItem) {
                return res.status(404).json({ success: false, message: 'Not found' });
            }

            res.json({ success: true, data: updatedItem });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await monitoredService.delete(id);

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Not found' });
            }

            res.json({ success: true, data: deleted });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MonitoredDestinationController();
