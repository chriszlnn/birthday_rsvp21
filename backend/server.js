import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rsvpRoutes from './routes/rsvpRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload limit to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/calendar', calendarRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'birthday_rsvp'
})
  .then(() => console.log('MongoDB connected to database: birthday_rsvp'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
