jest.mock('../api/services/monitoredDestinationService', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const monitoredDestinationController = require('../api/controllers/monitoredDestinationController');
const monitoredService = require('../api/services/monitoredDestinationService');
const httpMocks = require('node-mocks-http');

test('getAll returns all monitored destinations', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ id: 1, location: 'Location A', riskLevel: 'High', lastChecked: '2025-07-01' }];
  monitoredService.getAll.mockResolvedValueOnce(mockData);

  await monitoredDestinationController.getAll(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockData,
  });
  expect(monitoredService.getAll).toHaveBeenCalled();
});

test('getById returns a specific monitored destination', async () => {
  const req = httpMocks.createRequest({ params: { id: '1' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockItem = { id: 1, location: 'Location A', riskLevel: 'High', lastChecked: '2025-07-01' };
  monitoredService.getById.mockResolvedValueOnce(mockItem);

  await monitoredDestinationController.getById(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockItem,
  });
  expect(monitoredService.getById).toHaveBeenCalledWith(1);
});

test('create creates a new monitored destination and returns it', async () => {
  const req = httpMocks.createRequest({
    body: { location: 'Location B', riskLevel: 'Medium', lastChecked: '2025-07-10' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const newItem = { id: 2, location: 'Location B', riskLevel: 'Medium', lastChecked: '2025-07-10' };
  monitoredService.create.mockResolvedValueOnce(newItem);

  await monitoredDestinationController.create(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: newItem,
  });
  expect(monitoredService.create).toHaveBeenCalledWith('Location B', 'Medium', '2025-07-10');
});

test('update updates a monitored destination and returns it', async () => {
  const req = httpMocks.createRequest({
    params: { id: '1' },
    body: { location: 'Updated Location', riskLevel: 'Low', lastChecked: '2025-07-20' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const updatedItem = { id: 1, location: 'Updated Location', riskLevel: 'Low', lastChecked: '2025-07-20' };
  monitoredService.update.mockResolvedValueOnce(updatedItem);

  await monitoredDestinationController.update(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: updatedItem,
  });
  expect(monitoredService.update).toHaveBeenCalledWith(1, 'Updated Location', 'Low', '2025-07-20');
});

test('delete deletes a monitored destination and returns the deleted item', async () => {
  const req = httpMocks.createRequest({ params: { id: '1' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const deletedItem = { id: 1, location: 'Location A', riskLevel: 'High', lastChecked: '2025-07-01' };
  monitoredService.delete.mockResolvedValueOnce(deletedItem);

  await monitoredDestinationController.delete(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: deletedItem,
  });
  expect(monitoredService.delete).toHaveBeenCalledWith(1);
});

// Optional: Test error handling
test('getAll handles errors correctly', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const error = new Error('Database connection error');
  monitoredService.getAll.mockRejectedValueOnce(error);

  await monitoredDestinationController.getAll(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
});

test('getById handles error when item is not found', async () => {
  const req = httpMocks.createRequest({ params: { id: '999' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  monitoredService.getById.mockResolvedValueOnce(null);

  await monitoredDestinationController.getById(req, res, next);

  expect(res.statusCode).toBe(404);
  expect(res._getJSONData()).toEqual({
    success: false,
    message: 'Not found',
  });
});

test('create handles errors correctly', async () => {
  const req = httpMocks.createRequest({
    body: { location: 'Location C', riskLevel: 'High', lastChecked: '2025-07-15' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const error = new Error('Invalid data');
  monitoredService.create.mockRejectedValueOnce(error);

  await monitoredDestinationController.create(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
});

test('update handles error when item is not found', async () => {
  const req = httpMocks.createRequest({
    params: { id: '999' },
    body: { location: 'Updated Location', riskLevel: 'Low', lastChecked: '2025-07-20' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  monitoredService.update.mockResolvedValueOnce(null);

  await monitoredDestinationController.update(req, res, next);

  expect(res.statusCode).toBe(404);
  expect(res._getJSONData()).toEqual({
    success: false,
    message: 'Not found',
  });
});

test('delete handles error when item is not found', async () => {
  const req = httpMocks.createRequest({ params: { id: '999' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  monitoredService.delete.mockResolvedValueOnce(null);

  await monitoredDestinationController.delete(req, res, next);

  expect(res.statusCode).toBe(404);
  expect(res._getJSONData()).toEqual({
    success: false,
    message: 'Not found',
  });
});
