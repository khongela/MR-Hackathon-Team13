jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const AuthService = require('../api/services/authService');
const data = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser returns error if user already exists', async () => {
    const mockExistingUser = [{ id: 1, email: 'test@example.com' }];
    data.query.mockResolvedValueOnce({ rows: mockExistingUser });

    const result = await AuthService.registerUser('test@example.com', 'password', 'John Doe', '123 Main St');

    expect(result).toEqual({ error: 'User with this email already exists.' });
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "User" WHERE email = $1',
      values: ['test@example.com'],
    });
  });

  test('loginUser returns error if user does not exist', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    const result = await AuthService.loginUser('test@example.com', 'password');

    expect(result).toEqual({ error: 'Invalid credentials.' });
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "User" WHERE email = $1',
      values: ['test@example.com'],
    });
  });

  test('loginUser returns error if password is incorrect', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    data.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(false);

    const result = await AuthService.loginUser('test@example.com', 'wrongPassword');

    expect(result).toEqual({ error: 'Invalid credentials.' });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
  });

  test('loginUser successfully logs in a user and returns token', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    data.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockToken');

    const result = await AuthService.loginUser('test@example.com', 'password');

    expect(result).toEqual({
      user: { id: 1, email: 'test@example.com' },
      token: 'mockToken',
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1, email: 'test@example.com' },
      process.env.JWT_SECRET || 'wruyvcwubuo;ebtrnbijewoiuoicljehli',
      { expiresIn: '2h' }
    );
  });

  test('findUserByEmail returns user if found', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'John Doe', address: '123 Main St' };
    data.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await AuthService.findUserByEmail('test@example.com');

    expect(result).toEqual(mockUser);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "User" WHERE email = $1',
      values: ['test@example.com'],
    });
  });

});
