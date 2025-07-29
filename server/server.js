const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//express app creation
const app = express();
app.use(express.json());
app.use(cors());

const userRouter = require('./src/api/routes/userRoutes.js');
const notificationRouter = require('./src/api/routes/notificationroutes.js');

//route registration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notificationRouter);

/*folder to start in
app.use(express.static(path.join(__dirname, 'public')));*/

/*file to open at start
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'LoginPage.html'));
  });*/

//env port or local port
const PORT = process.env.PORT || 3500;

//Open up the server to listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
