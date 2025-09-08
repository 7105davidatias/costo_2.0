import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-filter backdrop-blur-[25px] bg-black/30 p-4 border border-primary/20 rounded-lg shadow-md text-right" dir="rtl">
        <p className="text-white font-semibold mb-3 text-base">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-base mb-1 font-medium text-white">
            {`${entry.name}: ₪${entry.value?.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CostTrendsChart() {
  const [animationPhase, setAnimationPhase] = useState(0);

  // נתונים לדוגמה עם אנימציה
  const data = [
    { month: 'ינואר', cost: 850000, prediction: 820000 },
    { month: 'פברואר', cost: 920000, prediction: 890000 },
    { month: 'מרץ', cost: 780000, prediction: 750000 },
    { month: 'אפריל', cost: 950000, prediction: 920000 },
    { month: 'מאי', cost: 1100000, prediction: 1050000 },
    { month: 'יוני', cost: 890000, prediction: 860000 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-64 relative overflow-hidden">
      {/* Grid background עם אפקט cyberpunk */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="1"/>
            </pattern>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:"rgba(0,255,255,0.8)", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"rgba(0,255,255,0.1)", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated chart bars */}
      <div className="flex items-end justify-between h-full p-4 relative z-10">
        {data.map((item, index) => (
          <div key={item.month} className="flex flex-col items-center gap-2">
            {/* Bar container */}
            <div className="relative h-48 w-12 flex flex-col justify-end">
              {/* Prediction bar (background) */}
              <div
                className="w-full bg-gradient-to-t from-purple-500/30 to-purple-400/50 rounded-t-lg border border-purple-500/40 relative overflow-hidden"
                style={{
                  height: `${(item.prediction / 1200000) * 100}%`,
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>

              {/* Actual cost bar */}
              <div
                className="w-full bg-gradient-to-t from-cyan-500/50 to-cyan-400/70 rounded-t-lg border border-cyan-400/60 relative overflow-hidden mt-1 neon-glow-cyan"
                style={{
                  height: `${(item.cost / 1200000) * 100}%`,
                  animation: `slideInUp 1s ease-out ${index * 0.15 + 0.3}s both`
                }}
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-300/20 to-transparent animate-pulse" />

                {/* Pulse effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/0 to-cyan-400/30 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Value display on hover */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-sm rounded px-2 py-1 text-xs whitespace-nowrap border border-cyan-500/40">
                <div className="text-cyan-400 font-medium">₪{(item.cost / 1000).toFixed(0)}K</div>
                <div className="text-purple-400 text-xs">חזי: ₪{(item.prediction / 1000).toFixed(0)}K</div>
              </div>
            </div>

            {/* Month label */}
            <div className="text-xs text-slate-400 font-medium">
              {item.month}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded border border-cyan-400/60" />
          <span className="text-cyan-400">עלות בפועל</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded border border-purple-400/60" />
          <span className="text-purple-400">תחזית AI</span>
        </div>
      </div>

      {/* Animated scanning line */}
      <div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        style={{
          transform: `translateY(${animationPhase * 60}px)`,
          transition: 'transform 2s ease-in-out'
        }}
      />
    </div>
  );
}