jest.mock('../api/services/notificationService', () => ({
  getAllNotifications: jest.fn(),
  getNotificationsByStatus: jest.fn(),
  postNewNotification: jest.fn(),
}));

const notificationController = require('../api/controllers/notificationController');
const notificationService = require('../api/services/notificationService');
const httpMocks = require('node-mocks-http');

test('getAllNotifications returns notifications with success true', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ id: 1, status: 'unread', title: 'Welcome' }];
  notificationService.getAllNotifications.mockResolvedValueOnce(mockData);

  await notificationController.getAllNotifications(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockData,
  });
  expect(notificationService.getAllNotifications).toHaveBeenCalled();
});

test('getNotificationsByStatus returns filtered notifications', async () => {
  const req = httpMocks.createRequest({ params: { status: 'unread' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockFiltered = [{ id: 2, status: 'unread', title: 'Reminder' }];
  notificationService.getNotificationsByStatus.mockResolvedValueOnce(mockFiltered);

  await notificationController.getNotificationsByStatus(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockFiltered,
  });
  expect(notificationService.getNotificationsByStatus).toHaveBeenCalledWith('unread');
});

test('postNewNotification creates new notification and returns it', async () => {
  const req = httpMocks.createRequest({
    body: { status: 'read', title: 'Test Alert' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockNotification = { id: 3, status: 'read', title: 'Test Alert' };
  notificationService.postNewNotification.mockResolvedValueOnce(mockNotification);

  await notificationController.postNewNotification(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockNotification,
  });
  expect(notificationService.postNewNotification).toHaveBeenCalledWith('read', 'Test Alert');
});

// Optional: Test error handling
test('getAllNotifications handles error correctly', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const error = new Error('Database connection error');
  notificationService.getAllNotifications.mockRejectedValueOnce(error);

  await notificationController.getAllNotifications(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
});

test('getNotificationsByStatus handles error correctly', async () => {
  const req = httpMocks.createRequest({ params: { status: 'unread' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const error = new Error('Service unavailable');
  notificationService.getNotificationsByStatus.mockRejectedValueOnce(error);

  await notificationController.getNotificationsByStatus(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
});

test('postNewNotification handles error correctly', async () => {
  const req = httpMocks.createRequest({
    body: { status: 'read', title: 'Test Alert' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const error = new Error('Invalid data');
  notificationService.postNewNotification.mockRejectedValueOnce(error);

  await notificationController.postNewNotification(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
});
