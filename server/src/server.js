const express = require('express');
const connectDatabase = require('./config/connectDatabase');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8989;

connectDatabase();

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', error);
    }
});
