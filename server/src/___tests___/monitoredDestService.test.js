const data = require('../config/database');
const MonitoredDestinationService = require('../api/services/monitoredDestinationService');

// Mock the database query
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('MonitoredDestinationService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should return all monitored destinations', async () => {
    const mockDestinations = [
      { id: 1, location: 'Location 1', riskLevel: 'High', lastChecked: '2025-07-29' },
      { id: 2, location: 'Location 2', riskLevel: 'Medium', lastChecked: '2025-07-29' }
    ];
    
    // Mocking the query method to return the mock data
    data.query.mockResolvedValueOnce({ rows: mockDestinations });

    const result = await MonitoredDestinationService.getAll();

    expect(result).toEqual(mockDestinations);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "MonitoredDestination" ORDER BY id ASC');
  });

  it('should return a monitored destination by ID', async () => {
    const mockDestination = { id: 1, location: 'Location 1', riskLevel: 'High', lastChecked: '2025-07-29' };
    
    data.query.mockResolvedValueOnce({ rows: [mockDestination] });

    const result = await MonitoredDestinationService.getById(1);

    expect(result).toEqual(mockDestination);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "MonitoredDestination" WHERE id = $1',
      values: [1]
    });
  });

  it('should return null if destination not found by ID', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    const result = await MonitoredDestinationService.getById(999); // Non-existent ID

    expect(result).toBeNull();
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "MonitoredDestination" WHERE id = $1',
      values: [999]
    });
  });

  it('should create a new monitored destination', async () => {
    const mockDestination = { id: 1, location: 'Location 1', riskLevel: 'High', lastChecked: '2025-07-29' };

    data.query.mockResolvedValueOnce({ rows: [mockDestination] });

    const result = await MonitoredDestinationService.create('Location 1', 'High', '2025-07-29');

    expect(result).toEqual(mockDestination);
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "MonitoredDestination" (location, riskLevel, lastChecked) VALUES ($1, $2, $3) RETURNING *',
      values: ['Location 1', 'High', '2025-07-29']
    });
  });

  it('should update an existing monitored destination', async () => {
    const mockDestination = { id: 1, location: 'Location 1', riskLevel: 'High', lastChecked: '2025-07-29' };

    data.query.mockResolvedValueOnce({ rows: [mockDestination] });

    const result = await MonitoredDestinationService.update(1, 'Updated Location', 'Medium', '2025-07-30');

    expect(result).toEqual(mockDestination);
    expect(data.query).toHaveBeenCalledWith({
      text: 'UPDATE "MonitoredDestination" SET location = $1, riskLevel = $2, lastChecked = $3 WHERE id = $4 RETURNING *',
      values: ['Updated Location', 'Medium', '2025-07-30', 1]
    });
  });

  it('should delete a monitored destination', async () => {
    const mockDestination = { id: 1, location: 'Location 1', riskLevel: 'High', lastChecked: '2025-07-29' };

    data.query.mockResolvedValueOnce({ rows: [mockDestination] });

    const result = await MonitoredDestinationService.delete(1);

    expect(result).toEqual(mockDestination);
    expect(data.query).toHaveBeenCalledWith({
      text: 'DELETE FROM "MonitoredDestination" WHERE id = $1 RETURNING *',
      values: [1]
    });
  });
});
