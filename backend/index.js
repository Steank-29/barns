const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const path = require('path');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const productRoutes = require('./routes/productRoutes');

app.use('/api/products', productRoutes)


// Test Route
app.get('/', (req, res) => {
  res.send(`
    <h1>Backend is running!</h1>
    <p>Database: ${process.env.DATA_BASE_NAME}</p>
    <p>Try <a href="/test-db">Test DB Connection</a></p>
  `);
});


// Test DB Route
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

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`Connected to database: "${process.env.DATA_BASE_NAME}"`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
};

startServer();