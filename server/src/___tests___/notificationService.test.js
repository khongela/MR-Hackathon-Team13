const data = require('../config/database');
const notificationService = require('../api/services/notificationService');

// Mock the database query method
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should return all notifications', async () => {
    const mockNotifications = [
      { id: 1, status: 'unread', title: 'Welcome to the system' },
      { id: 2, status: 'read', title: 'Your account has been updated' }
    ];

    // Mock the query method to return mock notifications
    data.query.mockResolvedValueOnce({ rows: mockNotifications });

    const result = await notificationService.getAllNotifications();

    expect(result).toEqual(mockNotifications);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "Notification" ORDER BY id ASC');
  });

  it('should return notifications by status', async () => {
    const mockNotifications = [
      { id: 1, status: 'unread', title: 'Welcome to the system' },
      { id: 2, status: 'unread', title: 'Your account has been updated' }
    ];

    // Mock the query method to return notifications with 'unread' status
    data.query.mockResolvedValueOnce({ rows: mockNotifications });

    const result = await notificationService.getNotificationsByStatus('unread');

    expect(result).toEqual(mockNotifications);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "Notification" WHERE status = $1',
      values: ['unread']
    });
  });

  it('should return an empty array if no notifications are found by status', async () => {
    // Mock the query method to return an empty array for 'read' status
    data.query.mockResolvedValueOnce({ rows: [] });

    const result = await notificationService.getNotificationsByStatus('read');

    expect(result).toEqual([]);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "Notification" WHERE status = $1',
      values: ['read']
    });
  });

  it('should insert a new notification successfully', async () => {
    const mockNewNotification = { id: 1, status: 'unread', title: 'New Notification' };

    // Mock the query method to simulate a successful insert
    data.query.mockResolvedValueOnce({ rows: [mockNewNotification] });

    const result = await notificationService.postNewNotification('unread', 'New Notification');

    expect(result).toEqual([mockNewNotification]);
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "Notification" (status,title) VALUES ($1,$2)',
      values: ['unread', 'New Notification']
    });
  });

  it('should throw an error if there is an issue inserting a new notification', async () => {
    // Mock the query method to throw an error
    data.query.mockRejectedValueOnce(new Error('Database error'));

    // Expect the function to throw an error
    await expect(notificationService.postNewNotification('unread', 'New Notification'))
      .rejects
      .toThrow('Error inserting notification: Database error');

    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "Notification" (status,title) VALUES ($1,$2)',
      values: ['unread', 'New Notification']
    });
  });
});
