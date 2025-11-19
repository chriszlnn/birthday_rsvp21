import React,{ useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar, X } from 'lucide-react';
import confetti from 'canvas-confetti';

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

    // Cleanup
    return () => {
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
          variant="ghost"
          size="icon"
          aria-label="Close success modal"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white transition-all duration-200 hover:bg-white/80 hover:text-purple-700 hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <X className="w-5 h-5" />
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
                  className="w-full bg-white text-purple-700 hover:bg-purple-50 border-2 border-purple-300 shadow-lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Add to Google Calendar
                </Button>
              </a>
              <a
                href="http://localhost:5001/api/calendar/ios"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full bg-purple-700/50 text-white hover:bg-purple-600/50 border-2 border-white/30 shadow-lg"
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
