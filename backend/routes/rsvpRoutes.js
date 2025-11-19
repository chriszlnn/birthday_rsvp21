import express from 'express';
import { Resend } from 'resend';
import Rsvp from '../models/Rsvp.js';
import dotenv from 'dotenv';


const router = express.Router();
dotenv.config();
const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;
const notificationRecipient =
  process.env.RSVP_NOTIFY_EMAIL || 'chrislynjules@gmail.com';

const escapeRegex = (value = '') =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET all RSVPs
router.get('/', async (req, res) => {
  try {
    const rsvps = await Rsvp.find();
    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET check for existing RSVP name (case-insensitive exact match)
router.get('/check-name', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ message: 'Name query parameter is required.', exists: false });
    }

    const normalizedName = escapeRegex(name.trim());

    const existingRsvp = await Rsvp.findOne({
      name: { $regex: `^${normalizedName}$`, $options: 'i' }
    });

    res.json({ exists: Boolean(existingRsvp) });
  } catch (err) {
    console.error('Error checking RSVP name:', err);
    res.status(500).json({ message: 'Failed to verify RSVP name.', exists: false });
  }
});

// POST a new RSVP
router.post('/', async (req, res) => {
  const { name, drinks, paymentReceiptUrl } = req.body;

  const newRsvp = new Rsvp({
    name,
    drinks,
    paymentReceiptUrl
  });

  try {
    const savedRsvp = await newRsvp.save();

    if (resendClient) {
      try {
        await resendClient.emails.send({
          from: 'Chrislyn RSVP <onboarding@resend.dev>',
          to: [notificationRecipient],
          subject: `New RSVP: ${savedRsvp.name || 'Guest'}`,
          html: `
            <div>
              <h2>🎉 New RSVP Received!</h2>
              <p><strong>Name:</strong> ${savedRsvp.name || 'Unknown'}</p>
              <p><strong>Drinks:</strong> ${savedRsvp.drinks || 'Not provided'}</p>
              <p><strong>Payment receipt included:</strong> ${
                savedRsvp.paymentReceiptUrl ? 'Yes' : 'No'
              }</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send RSVP notification email:', emailErr);
      }
    } else {
      console.warn('RESEND_API_KEY missing. Skipping RSVP notification email.');
    }

    res.status(201).json(savedRsvp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
