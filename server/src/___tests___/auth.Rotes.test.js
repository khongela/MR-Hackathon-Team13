const express = require('express');
const request = require('supertest');
const authRoutes = require('../api/routes/authRoutes');
const authController = require('../api/controllers/authController');

// Mock the controller methods
jest.mock('../api/controllers/authController', () => ({
  signup: jest.fn((req, res) => res.status(201).json({ success: true, message: 'User created' })),
  login: jest.fn((req, res) => res.status(200).json({ success: true, token: 'mock-token' })),
}));

// Set up app
const app = express();
app.use(express.json()); // important for parsing JSON request bodies
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  test('POST /api/auth/signup should call signup controller and return 201', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'test1234' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, message: 'User created' });
    expect(authController.signup).toHaveBeenCalled();
  });

  test('POST /api/auth/login should call login controller and return 200', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'test1234' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, token: 'mock-token' });
    expect(authController.login).toHaveBeenCalled();
  });
});
