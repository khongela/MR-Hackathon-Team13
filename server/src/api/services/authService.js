const data = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'wruyvcwubuo;ebtrnbijewoiuoicljehli';

class AuthService {
    async registerUser(email, password, name, address) {
        try {
            // Check if user already exists
            const existingUserQuery = {
                text: 'SELECT * FROM "User" WHERE email = $1',
                values: [email]
            };
            const existingUserResult = await data.query(existingUserQuery);

            if (existingUserResult.rows.length > 0) {
                return { error: 'User with this email already exists.' };
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user
            const query = {
                text: 'INSERT INTO "User" (email, password, name, address) VALUES ($1, $2, $3, $4) RETURNING id, email, name, address',
                values: [email, hashedPassword, name, address]
            };
            const result = await data.query(query);

            // Return the newly created user (without password)
            return result.rows[0]; 
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Could not register user due to a server error.');
        }
    }

    async loginUser(email, password) {
        try {
            // Find user by email
            const query = {
                text: 'SELECT * FROM "User" WHERE email = $1',
                values: [email]
            };
            const result = await data.query(query);

            if (result.rows.length === 0) {
                return { error: 'Invalid credentials.' };
            }

            const user = result.rows[0];

            // Compare provided password with hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return { error: 'Invalid credentials.' };
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '2h' } 
            );

            // Return user data (excluding password) and token
            const { password: _, ...userWithoutPassword } = user;
            return { user: userWithoutPassword, token };

        } catch (error) {
            console.error('Error logging in user:', error);
            throw new Error('Could not log in user due to a server error.');
        }
    }

    async findUserByEmail(email) {
        const query = {
            text: 'SELECT * FROM "User" WHERE email = $1',
            values: [email]
        };
        const result = await data.query(query);
        return result.rows[0];
    }
}

module.exports = new AuthService();