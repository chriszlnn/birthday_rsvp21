import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  onExpiredChange?: (expired: boolean) => void;
}

export function CountdownTimer({ onExpiredChange }: CountdownTimerProps) {
  // Target: 48 hours before November 28, 2025 at 8pm = November 26, 2025 at 8pm
  const targetDate = new Date("2025-11-28T20:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      };
    };

    // Calculate immediately
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    onExpiredChange?.(initialTime.expired);

    // Update every second
    const interval = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      onExpiredChange?.(newTime.expired);
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpiredChange]);

  if (timeLeft.expired) {
    return (
      <div
        className="p-6 rounded-lg"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p
            className="text-white text-2xl mb-2 tracking-wide"
            style={{
              fontFamily: "Special Gothic Expanded One, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            RSVP Forms Are Now Closed
          </p>
          <p
            className="text-black text-sm tracking-wide"
            style={{
              fontFamily: "Special Gothic Expanded One, sans-serif",
              fontWeight: 100,
              fontStyle: "normal",
            }}
          >
            Do contact Chrislyn if you didnt get to fill in the forms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="flex flex-col items-center">
        <p
          className="text-white text-xl mb-4 tracking-wide"
          style={{
            fontFamily: "Special Gothic Expanded One, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
          }}
        >
          RSVP Forms Close In
        </p>
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <div
              className="text-black text-3xl font-bold mb-1"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
              }}
            >
              {String(timeLeft.days).padStart(2, "0")}
            </div>
            <p
              className="text-black text-sm"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 100,
                fontStyle: "normal",
              }}
            >
              Days
            </p>
          </div>
         
          <div className="flex flex-col items-center">
            <div
              className="text-black text-3xl font-bold mb-1"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
              }}
            >
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <p
              className="text-black text-sm"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 100,
                fontStyle: "normal",
              }}
            >
              Hours
            </p>
          </div>
       
          <div className="flex flex-col items-center">
            <div
              className="text-black text-3xl font-bold mb-1"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
              }}
            >
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <p
              className="text-black text-sm"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 100,
                fontStyle: "normal",
              }}
            >
              Minutes
            </p>
          </div>
       
          <div className="flex flex-col items-center">
            <div
              className="text-black text-3xl font-bold mb-1"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
              }}
            >
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <p
              className="text-black text-sm"
              style={{
                fontFamily: "Special Gothic Expanded One, sans-serif",
                fontWeight: 100,
                fontStyle: "normal",
              }}
            >
              Seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

