import express from 'express';
import { createEvent } from 'ics';


const router = express.Router();

// iOS Calendar (.ics file)
router.get('/ios', (req, res) => {
  const event = {
    start: [2025, 11, 28, 20, 0], // e.g., 8:00 PM MYT (20:00)
    end:   [2025, 11, 29, 0, 0],   // e.g., 12:00 AM MYT (00:00 next day)
    timezone: 'Asia/Kuala_Lumpur', // 12 AM MYT -> 4 PM UTC
    title: "Chrislyn's 21st Birthday - Disco Fever!",
    description: "DRESS CODE: DISCO DRIP OR RETRO FIT✨",
    location: 'ARTE CHERAS',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: 'Chrislyn', email: 'chrislynjules@gmail.com' },
    
  };

  createEvent(event, (error, value) => {
    if (error) {
      console.error('Error generating calendar:', error);
      return res.status(500).send('Error generating calendar');
    }

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename=birthday.ics');
    res.send(value);
  });
});

export default router;

