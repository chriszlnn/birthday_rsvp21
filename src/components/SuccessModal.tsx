import React,{ useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_URL } from '../config';

interface SuccessModalProps {
  onClose: () => void;
}

export function SuccessModal({ onClose }: SuccessModalProps) {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9333ea', '#ffffff', '#6b7280']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9333ea', '#ffffff', '#6b7280']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Continuously disable pointer events on confetti canvases but keep them visible on top
    const disableConfettiClicks = setInterval(() => {
      const confettiCanvases = document.querySelectorAll('canvas');
      confettiCanvases.forEach(canvas => {
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '10000';
      });
    }, 100);

    // Cleanup
    return () => {
      clearInterval(disableConfettiClicks);
      confetti.reset();
    };
  }, []);

  // Google Calendar link
  const googleCalendarLink = () => {
    const title = encodeURIComponent("Chrislyn's 21st Birthday - Disco Fever!");
    const description = encodeURIComponent("DRESS CODE: DISCO DRIP OR RETRO FIT");
    const location = encodeURIComponent("Arte Cheras");
    const start = "20251128T120000Z"; // 8:00 PM MYT -> 12:00 PM UTC
    const end   = "20251128T160000Z";   // November 29, 2025, 12:00 AM UTC

    return `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${start}/${end}&details=${description}&location=${location}`;
  };

  const handleBackdropClick = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={handleBackdropClick}
    >
      <Card 
        className="bg-gradient-to-br from-purple-600 to-purple-800 border-4 border-white shadow-2xl max-w-md w-full relative animate-in zoom-in duration-500 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          size="icon"
          aria-label="Close success modal"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            onClose();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4"
          style={{ 
            pointerEvents: 'auto',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            boxShadow: 'none',
            zIndex: 10001,

          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'white';
          }}
        >
          <X className="w-5 h-5 pointer-events-none" />
        </Button>

        <CardContent className="pt-12 pb-8 text-center">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          
          <h2 className="text-white text-4xl mb-2 tracking-wide" style={{ fontFamily: 'Impact, sans-serif' }}>
            YAY!
          </h2>
          
          <p className="text-purple-100 text-xl mb-8">
            Your attendance is recorded! ✨
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-white/20 mb-6">
            <p className="text-white mb-4">
              Don't forget to mark your calendar!
            </p>
            <div className="space-y-3">
              <a
                href={googleCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full bg-purple-700/50 text-white border-2 border-white/30 shadow-lg"
                  style={{
                    backgroundColor: 'rgba(126, 34, 206, 0.5)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(126, 34, 206, 0.5)';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Add to Google Calendar
                </Button>
              </a>
              <a
                href={`${API_URL}/api/calendar/ios`}
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full bg-purple-700/50 text-white border-2 border-white/30 shadow-lg"
                  style={{
                    backgroundColor: 'rgba(126, 34, 206, 0.5)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(126, 34, 206, 0.5)';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Add to iOS Calendar
                </Button>
              </a>
            </div>
          </div>

          <div className="text-purple-200 text-sm">
            See you at the party! 🪩
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
