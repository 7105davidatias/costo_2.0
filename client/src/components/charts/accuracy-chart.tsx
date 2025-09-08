import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';

const data = [
  { method: 'תלת נקודות', accuracy: 85, requests: 12 },
  { method: 'מבוסס זמן', accuracy: 92, requests: 8 },
  { method: 'השוואתי', accuracy: 78, requests: 15 },
  { method: 'מבוסס שוק', accuracy: 88, requests: 10 },
  { method: 'AI משולב', accuracy: 94, requests: 6 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-filter backdrop-blur-[25px] bg-black/30 p-4 border border-primary/20 rounded-lg shadow-md text-right" dir="rtl">
        <p className="text-white font-semibold mb-3 text-base">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-base mb-1 font-medium text-white">
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AccuracyChart() {
  const [accuracy, setAccuracy] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const targetAccuracy = 94.2;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAccuracy(prev => {
          const next = prev + 1.2;
          if (next >= targetAccuracy) {
            clearInterval(interval);
            setIsAnimating(false);
            return targetAccuracy;
          }
          return next;
        });
      }, 30);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const circumference = 2 * Math.PI * 80;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return { main: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' };
    if (acc >= 80) return { main: '#00ffff', glow: 'rgba(0, 255, 255, 0.6)' };
    if (acc >= 70) return { main: '#ffff00', glow: 'rgba(255, 255, 0, 0.6)' };
    return { main: '#ff6b6b', glow: 'rgba(255, 107, 107, 0.6)' };
  };

  const colors = getAccuracyColor(accuracy);

  return (
    <div className="h-64 flex flex-col items-center justify-center relative">
      {/* Main accuracy circle */}
      <div className="relative">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: colors.main, stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: colors.main, stopOpacity: 0.6}} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />

          {/* Accuracy progress circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="url(#accuracyGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            filter="url(#glow)"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease',
              filter: `drop-shadow(0 0 10px ${colors.glow})`
            }}
          />

          {/* Animated dots along the circle */}
          {[0, 90, 180, 270].map((angle, index) => (
            <circle
              key={angle}
              cx={100 + 80 * Math.cos((angle * Math.PI) / 180)}
              cy={100 + 80 * Math.sin((angle * Math.PI) / 180)}
              r="3"
              fill={colors.main}
              style={{
                animation: `pulse 2s ease-in-out infinite ${index * 0.5}s`,
                filter: `drop-shadow(0 0 5px ${colors.glow})`
              }}
            />
          ))}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-4xl font-bold neon-text-primary"
            style={{
              color: colors.main,
              textShadow: `0 0 20px ${colors.glow}`
            }}
          >
            {accuracy.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-1">דיוק AI</div>

          {/* Animated rings */}
          {isAnimating && (
            <div className="absolute inset-0">
              {[1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className="absolute inset-0 border-2 rounded-full animate-ping"
                  style={{
                    borderColor: colors.main,
                    animationDelay: `${ring * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats below chart */}
      <div className="grid grid-cols-3 gap-4 mt-6 w-full">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">96.8%</div>
          <div className="text-xs text-slate-400">השבוע</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">94.2%</div>
          <div className="text-xs text-slate-400">ממוצע</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">91.5%</div>
          <div className="text-xs text-slate-400">החודש</div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: colors.main,
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animation: `float 4s ease-in-out infinite ${i * 0.8}s`,
              boxShadow: `0 0 10px ${colors.glow}`
            }}
          />
        ))}
      </div>
    </div>
  );
}