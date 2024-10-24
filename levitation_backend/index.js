const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const corsOptions = {
    origin: '*',  // Allow all origins. Replace '*' with specific domains if needed, e.g. ['https://your-frontend-domain.com']
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Specify allowed headers
  };
  
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', pdfRoutes);

// Handle application termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
