const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/teamNotes');

dotenv.config();

const application = express();
const PORT = process.env.SERVER_PORT || 8080;

application.use(bodyParser.json());

mongoose.connect(process.env.DB_CONNECTION_STRING_DEV).then(() => {
    console.log('Connected to MongoDB');
    application.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Failed to connect to MongoDB');
    console.log(err);
});

application.use('/api/auth', authRoutes);
application.use('/api/teamNotes', notesRoutes);
application.use('*', (req, res) => {
    res.status(404).json({
        error: `Not Found: ${req.originalUrl}`
    });
})

module.exports = application;