const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

// Import route handlers
const userRouter = require('./src/api/routes/userRoutes.js');
const authRouter = require('./src/api/routes/authRoutes.js');
const notificationRouter = require('./src/api/routes/notificationroutes.js');
const monitoredDestinationRouter = require('./src/api/routes/monitoredDestinationRoutes.js'); 

// Register routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/monitored-destinations', monitoredDestinationRouter); 

// Serve static files (if needed in future)
// app.use(express.static(path.join(__dirname, 'public')));

// Example entry route (if needed)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/html', 'LoginPage.html'));
// });

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
