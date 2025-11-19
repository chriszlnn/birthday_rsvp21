import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  drinks: { type: String, default: '' },
  paymentReceiptUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Rsvp', rsvpSchema, 'rsvpData');
