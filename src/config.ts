// API Configuration
// Use Render backend URL for production, localhost for development
export const API_URL = import.meta.env.PROD
  ? "https://birthday-rsvp21.onrender.com"
  : "http://localhost:5001";

