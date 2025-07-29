// Mock console methods to capture logging output
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

// Create mock client instance that will be reused
const mockClientInstance = {
    connect: jest.fn((cb) => cb && cb(null)),
    query: jest.fn(),
    end: jest.fn(),
};

// Mock pg module at the top level
jest.mock('pg', () => {
    return { 
        Client: jest.fn(() => mockClientInstance)
    };
});

describe('Database connection', () => {
    let Client, dbClient;

    beforeEach(() => {
        // Clear mocks first to ensure clean state
        jest.clearAllMocks();
        mockConsoleError.mockClear();
        mockConsoleLog.mockClear();
        
        // Reset the mock client methods
        mockClientInstance.connect.mockImplementation((cb) => cb && cb(null));
        
        // Reset modules to ensure fresh import
        jest.resetModules();
        
        // Import after clearing modules
        Client = require('pg').Client;
        dbClient = require('../config/database'); // adjust this path
    });

    test('should create a new PG client with correct configuration', () => {
        expect(Client).toHaveBeenCalledWith({
            connectionString: 'postgres://mrhackathon:postgres@2025@mr-hackathon-db.postgres.database.azure.com:5432/postgres',
            ssl: { rejectUnauthorized: false }
        });
        expect(Client).toHaveBeenCalledTimes(1);
    });

    test('should call connect on the client with callback', () => {
        expect(mockClientInstance.connect).toHaveBeenCalled();
        expect(mockClientInstance.connect).toHaveBeenCalledWith(expect.any(Function));
        expect(mockClientInstance.connect).toHaveBeenCalledTimes(1);
    });

    test('should log success message on successful connection', () => {
        expect(mockConsoleLog).toHaveBeenCalledWith('Database connected successfully.');
    });

    test('should export the client instance', () => {
        expect(dbClient).toBeDefined();
        expect(dbClient).toBe(mockClientInstance);
    });

    test('should handle and log connection errors', () => {
        // Clear previous calls
        jest.clearAllMocks();
        mockConsoleError.mockClear();
        mockConsoleLog.mockClear();
        
        // Create an error with stack trace
        const connectionError = new Error('Connection failed');
        connectionError.stack = 'Error: Connection failed\n    at Client.connect';
        
        // Mock connect to call callback with error
        mockClientInstance.connect.mockImplementation((cb) => cb && cb(connectionError));
        
        // Reset modules and re-require to trigger the connection with error
        jest.resetModules();
        require('../config/database');
        
        expect(mockClientInstance.connect).toHaveBeenCalled();
        expect(mockConsoleError).toHaveBeenCalledWith('Connection error:', connectionError.stack);
        expect(mockConsoleLog).not.toHaveBeenCalled();
    });
});

// Test for connection callback behavior
describe('Database connection callback', () => {
    let mockClient;

    beforeEach(() => {
        jest.clearAllMocks();
        mockConsoleError.mockClear();
        mockConsoleLog.mockClear();
        jest.resetModules();
        
        // Create a fresh mock client for each test
        mockClient = {
            connect: jest.fn(),
            query: jest.fn(),
            end: jest.fn()
        };
        
        // Mock the Client constructor to return our mock
        const { Client } = require('pg');
        Client.mockImplementation(() => mockClient);
    });

    test('should execute callback with null error on successful connection', () => {
        // Require the database module which will call connect
        require('../config/database');

        // Verify connect was called
        expect(mockClient.connect).toHaveBeenCalledTimes(1);
        expect(mockClient.connect).toHaveBeenCalledWith(expect.any(Function));

        // Get the callback function that was passed to connect
        const connectCallback = mockClient.connect.mock.calls[0][0];
        
        // Call the callback with no error (successful connection)
        connectCallback(null);
        
        expect(mockConsoleLog).toHaveBeenCalledWith('Database connected successfully.');
        expect(mockConsoleError).not.toHaveBeenCalled();
    });

    test('should execute callback with error and log error details', () => {
        // Require the database module which will call connect
        require('../config/database');

        // Verify connect was called
        expect(mockClient.connect).toHaveBeenCalledTimes(1);

        // Get the callback function that was passed to connect
        const connectCallback = mockClient.connect.mock.calls[0][0];
        
        // Create an error with stack trace
        const error = new Error('Database connection failed');
        error.stack = 'Error: Database connection failed\n    at Client.connect\n    at Database.connect';
        
        // Call the callback with error
        connectCallback(error);
        
        expect(mockConsoleError).toHaveBeenCalledWith('Connection error:', error.stack);
        expect(mockConsoleLog).not.toHaveBeenCalled();
    });
});