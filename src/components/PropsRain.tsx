import React, { useEffect, useState, useMemo } from 'react';
import props1 from '../assets/props-1.svg';
import props2 from '../assets/props-2.svg';
import props3 from '../assets/props-3.svg';
import props4 from '../assets/props-4.svg';
import props5 from '../assets/props-5.svg';

interface PropsRainProps {
  duration?: number; // Duration in milliseconds
  onComplete?: () => void;
}

interface PropData {
  src: string;
  delay: number;
  duration: number;
  left: number;
  size: number;
  drift: number;
}

export function PropsRain({ duration = 3000, onComplete }: PropsRainProps) {
  const [isActive, setIsActive] = useState(true);
  const props = [props1, props2, props3, props4, props5];

  useEffect(() => {
    console.log('PropsRain component mounted and active!');
  }, []);

  // Generate random prop data once using useMemo
  const propData = useMemo<PropData[]>(() => {
    return Array.from({ length: 30 }).map(() => ({
      src: props[Math.floor(Math.random() * props.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2, // 2-4 seconds
      left: Math.random() * 100,
      size: 80 + Math.random() * 120, // 80-200px (larger and more visible)
      drift: (Math.random() - 0.5) * 30, // Random horizontal drift
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isActive) return null;

  return (
    <>
      <style>{`
        @keyframes rainDown {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden" style={{ zIndex: 10000 }}>
        {propData.map((prop, i) => {
          // Include drift in the left position
          const adjustedLeft = prop.left + prop.drift;
          
          return (
            <img
              key={i}
              src={prop.src}
              alt=""
              className="absolute"
              style={{
                left: `${adjustedLeft}%`,
                top: '-10%',
                width: `${prop.size}px`,
                height: `${prop.size}px`,
                animation: `rainDown ${prop.duration}s ease-in ${prop.delay}s forwards`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}

