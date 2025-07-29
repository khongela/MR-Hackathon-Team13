jest.mock('../api/services/userService', () => ({
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  patchUserName: jest.fn(),
  patchUserEmail: jest.fn(),
  patchUserPassword: jest.fn(),
  patchUserAddress: jest.fn(),
  postNewUser: jest.fn(),
}));

const userController = require('../api/controllers/userController');
const userService = require('../api/services/userService');
const httpMocks = require('node-mocks-http');

test('getAllUsers returns users with 200 status', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockUsers = [{ id: 1, email: 'user@example.com' }];
  userService.getAllUsers.mockResolvedValueOnce(mockUsers);

  await userController.getAllUsers(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockUsers,
  });
  expect(userService.getAllUsers).toHaveBeenCalled();
});

test('getUserById returns user data', async () => {
  const req = httpMocks.createRequest({ params: { id: '42' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockUser = { id: 42, email: 'test@example.com' };
  userService.getUserById.mockResolvedValueOnce(mockUser);

  await userController.getUserById(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockUser,
  });
  expect(userService.getUserById).toHaveBeenCalledWith('42');
});

test('getUserEmail uses getUserById to return data', async () => {
  const req = httpMocks.createRequest({ params: { email: 'john@example.com' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockUser = { id: 7, email: 'john@example.com' };
  userService.getUserById.mockResolvedValueOnce(mockUser);

  await userController.getUserEmail(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockUser,
  });
  expect(userService.getUserById).toHaveBeenCalledWith('john@example.com');
});

test('patchUserName updates the user name', async () => {
  const req = httpMocks.createRequest({ params: { id: '1', name: 'UpdatedName' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const updatedUser = { id: 1, name: 'UpdatedName' };
  userService.patchUserName.mockResolvedValueOnce(updatedUser);

  await userController.patchUserName(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: updatedUser,
  });
  expect(userService.patchUserName).toHaveBeenCalledWith('1', 'UpdatedName');
});

test('patchUserEmail updates the user email', async () => {
  const req = httpMocks.createRequest({ params: { id: '2', email: 'new@example.com' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const updatedUser = { id: 2, email: 'new@example.com' };
  userService.patchUserEmail.mockResolvedValueOnce(updatedUser);

  await userController.patchUserEmail(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: updatedUser,
  });
  expect(userService.patchUserEmail).toHaveBeenCalledWith('2', 'new@example.com');
});

test('patchUserPassword updates the user password', async () => {
  const req = httpMocks.createRequest({ params: { id: '3', password: 'newpass123' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const updatedUser = { id: 3, password: 'newpass123' };
  userService.patchUserPassword.mockResolvedValueOnce(updatedUser);

  await userController.patchUserPassword(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: updatedUser,
  });
  expect(userService.patchUserPassword).toHaveBeenCalledWith('3', 'newpass123');
});

test('patchUserAddress updates the user address', async () => {
  const req = httpMocks.createRequest({ params: { id: '4', address: '123 Main St' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const updatedUser = { id: 4, address: '123 Main St' };
  userService.patchUserAddress.mockResolvedValueOnce(updatedUser);

  await userController.patchUserAddress(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: updatedUser,
  });
  expect(userService.patchUserAddress).toHaveBeenCalledWith('4', '123 Main St');
});
