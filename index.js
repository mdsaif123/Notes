import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import ConnDB from './config/db.js';
import authRoutes from './Routes/authRoutes.js';

import noteroutes from "./Routes/NotesRoute.js"
import cors from 'cors';


dotenv.config();

// Create Express app
const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());


// Connection to database
ConnDB();

// Routes
app.use('/', authRoutes);
app.use('/', noteroutes);

// Basic API endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// File upload handling endpoint (optional, if you need it for other uploads)


// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`.cyan.bold);
});
