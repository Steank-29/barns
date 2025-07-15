const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const cors = require('cors');
const path = require('path');

// Routes imports
const barriereRoutes = require('./routes/Barriere');
const facadeRoutes = require('./routes/Facade');
const threeBoxRoutes = require('./routes/ThreeBox');
const twoBoxRoutes = require('./routes/TwoBox');
const twoBoxResinRoutes = require('./routes/TwoBoxResin');
const fiveBoxRoutes = require('./routes/FiveBox');
const authRoutes = require('./routes/auth');

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://barns.onrender.com',
  'https://barns-five.vercel.app/',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/barriere', barriereRoutes);
app.use('/api/facade', facadeRoutes);
app.use('/api/twobox', twoBoxRoutes);
app.use('/api/threebox', threeBoxRoutes);
app.use('/api/twoboxresin', twoBoxResinRoutes);
app.use('/api/fivebox', fiveBoxRoutes);
app.use('/api/auth', authRoutes);

// Status route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Backend Status</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #38598b, #38598b);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          animation: fadeIn 1s ease-in-out;
        }
        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        h1 {
          margin-bottom: 20px;
          font-size: 2.5rem;
        }
        p {
          font-size: 1.2rem;
        }
        a {
          display: inline-block;
          margin-top: 20px;
          text-decoration: none;
          color: #fff;
          background-color: #1abc9c;
          padding: 10px 20px;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        a:hover {
          background-color: #16a085;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎯 Backend is Running!</h1>
        <p>📦 Database: <strong>${process.env.DATA_BASE_NAME || 'Not Set'}</strong></p>
        <a href="/test-db">🔍 Test DB Connection</a>
      </div>
    </body>
    </html>
  `);
});

// Database test route
app.get('/test-db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({
      status: 'SUCCESS',
      database: process.env.DATA_BASE_NAME,
      collections: collections.map(c => c.name)
    });
  } catch (err) {
    res.status(500).json({
      status: 'FAILED',
      error: err.message
    });
  }
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to database: "${process.env.DATA_BASE_NAME}"`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); 
  }
};

// Vercel requires module.exports instead of app.listen
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  startServer();
}