/**
 * SeemantSaathi Backend Server
 * Developed by: Ansh Karki
 * * Entry point for the API. Handles middleware, routing, and error management.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import Routes (Defined below or in separate files)
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. Security & Middleware Layer ---

// Helmet for security headers (Prevents XSS, Sniffing)
app.use(helmet());

// CORS - Allow connection from your Frontend (Open for Hackathon demo)
app.use(cors());

// Body Parser - JSON data (Limit 10kb to prevent payload attacks)
app.use(express.json({ limit: '10kb' }));

// Logging - detailed logs for dev, short for prod
app.use(morgan('dev'));

// Rate Limiting - Crucial for Rural Infrastructure
// Limits each IP to 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);


// --- 2. API Routes ---
app.use('/api', apiRoutes);

// --- 3. Global Error Handler ---
app.use((err, req, res, next) => {
    console.error('🔥 Error Stack:', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong on the server!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// --- 4. Start Server ---
app.listen(PORT, () => {
    console.log(`
    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
    ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
    ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
    ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
    ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
    
    🚀 SeemantSaathi Backend Running on Port ${PORT}
    📡 Environment: ${process.env.NODE_ENV || 'development'}
    `);
});