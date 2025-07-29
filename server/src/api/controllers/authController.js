const authService = require('../services/authService');

class AuthController {
    async signup(req, res, next) {
        try {
            const { email, password, name, address } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, password, and name are required for signup.'
                });
            }

            const newUser = await authService.registerUser(email, password, name, address);

            if (newUser.error) {
                return res.status(409).json({
                    success: false,
                    message: newUser.error
                });
            }

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required for login.'
                });
            }

            const result = await authService.loginUser(email, password);

            if (result.error) {
                return res.status(401).json({
                    success: false,
                    message: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token: result.token,
                user: result.user
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();