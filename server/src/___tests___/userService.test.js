const data = require('../config/database');
const userService = require('../api/services/userService');

// Mock the database query method
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should return all users', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', address: '456 Elm St' }
    ];

    data.query.mockResolvedValueOnce({ rows: mockUsers });

    const result = await userService.getAllUsers();

    expect(result).toEqual(mockUsers);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "User" ORDER BY id ASC');
  });

  it('should return a user by ID', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St' };

    data.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await userService.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "User" WHERE id = $1',
      values: [1]
    });
  });

  it('should throw an error if user not found by ID', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(userService.getUserById(999))
      .rejects
      .toThrow('User not found');
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "User" WHERE id = $1',
      values: [999]
    });
  });

  it('should return a user by email', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St' };

    data.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await userService.getUserByIEmail('john@example.com');

    expect(result).toEqual(mockUser);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "User" WHERE email = $1',
      values: ['john@example.com']
    });
  });

  it('should throw an error if user not found by email', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(userService.getUserByIEmail('nonexistent@example.com'))
      .rejects
      .toThrow('User not found');
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM "User" WHERE email = $1',
      values: ['nonexistent@example.com']
    });
  });

  it('should update a user name', async () => {
    const mockUser = { id: 1, name: 'Updated Name', email: 'john@example.com', address: '123 Main St' };

    data.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await userService.patchUserName(1, 'Updated Name');

    expect(result).toEqual(mockUser);
    expect(data.query).toHaveBeenCalledWith({
      text: 'UPDATE "User" SET name = $2 Where id = $1 Returning *',
      values: [1, 'Updated Name']
    });
  });

  it('should throw an error if user not found during name update', async () => {
    data.query.mockResolvedValueOnce({ rowCount: 0 });

    await expect(userService.patchUserName(999, 'Updated Name'))
      .rejects
      .toThrow('User not found');
    expect(data.query).toHaveBeenCalledWith({
      text: 'UPDATE "User" SET name = $2 Where id = $1 Returning *',
      values: [999, 'Updated Name']
    });
  });

  it('should update user email', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'newemail@example.com', address: '123 Main St' };

    data.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await userService.patchUserEmail(1, 'newemail@example.com');

    expect(result).toEqual(mockUser);
    expect(data.query).toHaveBeenCalledWith({
      text: 'UPDATE "User" SET email = $2 Where id = $1 Returning *',
      values: [1, 'newemail@example.com']
    });
  });

  it('should throw an error if user not found during email update', async () => {
    data.query.mockResolvedValueOnce({ rowCount: 0 });

    await expect(userService.patchUserEmail(999, 'newemail@example.com'))
      .rejects
      .toThrow('User not found');
    expect(data.query).toHaveBeenCalledWith({
      text: 'UPDATE "User" SET email = $2 Where id = $1 Returning *',
      values: [999, 'newemail@example.com']
    });
  });

  it('should insert user details successfully with putUserDetails', async () => {
    const mockNewUser = { id: 1, email: 'john@example.com', password: 'password123', address: '123 Main St', name: 'John Doe' };

    data.query.mockResolvedValueOnce({ rows: [mockNewUser] });

    const result = await userService.putUserDetails(1, 'john@example.com', 'password123', '123 Main St', 'John Doe');

    expect(result).toEqual([mockNewUser]);
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "User" (id,email,password,address,name) VALUES ($1,$2,$3,$4,$5)',
      values: [1, 'john@example.com', 'password123', '123 Main St', 'John Doe']
    });
  });

  it('should handle user already registered in putUserDetails', async () => {
    const error = { code: '23505', message: 'duplicate key value violates unique constraint' };

    data.query.mockRejectedValueOnce(error);

    const result = await userService.putUserDetails(1, 'john@example.com', 'password123', '123 Main St', 'John Doe');

    expect(result).toEqual({ error: 'User already registered.' });
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "User" (id,email,password,address,name) VALUES ($1,$2,$3,$4,$5)',
      values: [1, 'john@example.com', 'password123', '123 Main St', 'John Doe']
    });
  });

  it('should insert a new user successfully with postNewUser', async () => {
    const mockNewUser = { id: 1, email: 'john@example.com', password: 'password123', address: '123 Main St', name: 'John Doe' };

    data.query.mockResolvedValueOnce({ rows: [mockNewUser] });

    const result = await userService.postNewUser(1, 'john@example.com', 'password123', '123 Main St', 'John Doe');

    expect(result).toEqual([mockNewUser]);
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "User" (id,email,password,address,name) VALUES ($1,$2,$3)',
      values: [1, 'john@example.com', 'password123', '123 Main St', 'John Doe']
    });
  });

  it('should handle user already registered in postNewUser', async () => {
    const error = { code: '23505', message: 'duplicate key value violates unique constraint' };

    data.query.mockRejectedValueOnce(error);

    const result = await userService.postNewUser(1, 'john@example.com', 'password123', '123 Main St', 'John Doe');

    expect(result).toEqual({ error: 'User already registered.' });
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "User" (id,email,password,address,name) VALUES ($1,$2,$3)',
      values: [1, 'john@example.com', 'password123', '123 Main St', 'John Doe']
    });
  });
});
