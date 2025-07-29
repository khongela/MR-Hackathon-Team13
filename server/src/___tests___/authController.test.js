const AuthController = require('../api/controllers/authController');
const authService = require('../api/services/authService');

// Mock the authService
jest.mock('../api/services/authService');

describe('AuthController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('signup', () => {
        it('should return 400 if email, password, or name are missing', async () => {
            req.body = { email: '', password: '', name: '' };

            await AuthController.signup(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email, password, and name are required for signup.'
            });
        });

        it('should return 409 if user already exists', async () => {
            req.body = { email: 'test@example.com', password: 'password', name: 'Test User' };
            authService.registerUser.mockResolvedValueOnce({ error: 'User already exists' });

            await AuthController.signup(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'User already exists'
            });
        });

        it('should return 201 if user is registered successfully', async () => {
            const newUser = { id: 1, email: 'test@example.com', name: 'Test User' };
            req.body = { email: 'test@example.com', password: 'password', name: 'Test User' };
            authService.registerUser.mockResolvedValueOnce(newUser);

            await AuthController.signup(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User registered successfully',
                data: newUser
            });
        });

        it('should call next with an error if an exception is thrown', async () => {
            req.body = { email: 'test@example.com', password: 'password', name: 'Test User' };
            authService.registerUser.mockRejectedValueOnce(new Error('Database error'));

            await AuthController.signup(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('login', () => {
        it('should return 400 if email or password is missing', async () => {
            req.body = { email: '', password: '' };

            await AuthController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email and password are required for login.'
            });
        });

        it('should return 401 if login fails', async () => {
            req.body = { email: 'test@example.com', password: 'wrongpassword' };
            authService.loginUser.mockResolvedValueOnce({ error: 'Invalid credentials' });

            await AuthController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid credentials'
            });
        });

        it('should return 200 if login is successful', async () => {
            const result = { token: 'some-token', user: { id: 1, email: 'test@example.com' } };
            req.body = { email: 'test@example.com', password: 'password' };
            authService.loginUser.mockResolvedValueOnce(result);

            await AuthController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Login successful',
                token: result.token,
                user: result.user
            });
        });

        it('should call next with an error if an exception is thrown', async () => {
            req.body = { email: 'test@example.com', password: 'password' };
            authService.loginUser.mockRejectedValueOnce(new Error('Database error'));

            await AuthController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});


afterAll(() => {
  // Close database connection if opened
  if (global.db) {
    global.db.close();  // Example: Close the DB connection
  }
});
