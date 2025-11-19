import express from 'express';
import ical from 'ical-generator';
import moment from 'moment-timezone';

const router = express.Router();

router.get('/ios', (req, res) => {

  const cal = ical({
    name: "Chrislyn's 21st Birthday - Disco Fever!",
    timezone: 'Asia/Kuala_Lumpur'
  });

  // Build start + end times with timezone using moment-timezone
  const start = moment.tz('2025-11-28 20:00', 'Asia/Kuala_Lumpur');
  const end   = moment.tz('2025-11-29 00:00', 'Asia/Kuala_Lumpur');

  cal.createEvent({
    start,
    end,
    summary: "Chrislyn's 21st Birthday - Disco Fever!",
    description: "DRESS CODE: DISCO DRIP OR RETRO FIT✨",
    location: "ARTE CHERAS",
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: {
      name: 'Chrislyn',
      email: 'chrislynjules@gmail.com'
    }
  });

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename=birthday.ics');
  res.send(cal.toString());
});

export default router;
