
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceTrackingData {
  date: string;
  current: number;
  predicted: number;
  market: number;
}

interface PriceTrackingChartProps {
  data: PriceTrackingData[];
  className?: string;
}

// Custom Glass Tooltip
const GlassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border-procurement-primary-neon/30 p-4 shadow-neon-soft rounded-glass backdrop-blur-md">
        <p className="text-procurement-text-primary font-medium mb-2 text-sm">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs mb-1" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {entry.value.toLocaleString()} ₪
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Glass Legend
const GlassLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="glass-button px-3 py-1 rounded-procurement-md hover:shadow-neon-soft transition-all duration-300">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: entry.color,
                boxShadow: `0 0 6px ${entry.color}`
              }}
            />
            <span className="text-procurement-text-primary text-xs font-medium">
              {entry.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const PriceTrackingChart = ({ data, className = "" }: PriceTrackingChartProps) => {
  return (
    <div className={`glass-panel p-6 rounded-procurement-xl border border-procurement-accent-pink/20 ${className}`}>
      {/* Glass Container Header */}
      <div className="glass-float mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-procurement-accent-pink rounded-full shadow-neon-strong animate-pulse-glow" />
          <h3 className="text-procurement-text-primary font-semibold text-lg">
            מעקב מחירים
          </h3>
        </div>
      </div>

      {/* Chart Glass Container */}
      <div className="glass-panel bg-procurement-background-card/30 backdrop-blur-sm rounded-procurement-lg p-4">
        <div className="h-80 relative">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-procurement-accent-pink/5 via-transparent to-procurement-primary-neon/5 rounded-procurement-lg" />
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                {/* Glass Area Gradients */}
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff0080" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff0080" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              {/* Glass Grid */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(0, 255, 255, 0.1)"
                strokeWidth={1}
              />
              
              {/* Glass Axes */}
              <XAxis 
                dataKey="date"
                stroke="#00ffff"
                tick={{ fill: '#00ffff', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(0, 255, 255, 0.3)' }}
                tickLine={{ stroke: 'rgba(0, 255, 255, 0.3)' }}
              />
              <YAxis 
                stroke="#00ffff"
                tick={{ fill: '#00ffff', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(0, 255, 255, 0.3)' }}
                tickLine={{ stroke: 'rgba(0, 255, 255, 0.3)' }}
                tickFormatter={(value) => `${value.toLocaleString()}₪`}
              />

              {/* Glass Tooltip */}
              <Tooltip content={<GlassTooltip />} />
              
              {/* Glass Legend */}
              <Legend content={<GlassLegend />} />

              {/* Neon Areas with Glow Effects */}
              <Area
                type="monotone"
                dataKey="market"
                stackId="1"
                stroke="#ff0080"
                strokeWidth={2}
                fill="url(#marketGradient)"
                name="מחיר שוק"
                dot={{ fill: '#ff0080', strokeWidth: 2, r: 4 }}
                activeDot={{ 
                  r: 6, 
                  fill: '#ff0080',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 0 8px #ff0080)'
                }}
                style={{
                  filter: 'drop-shadow(0 0 3px #ff0080)',
                }}
              />
              
              <Area
                type="monotone"
                dataKey="predicted"
                stackId="2"
                stroke="#00ff88"
                strokeWidth={2}
                fill="url(#predictedGradient)"
                name="חיזוי מחיר"
                dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
                activeDot={{ 
                  r: 6, 
                  fill: '#00ff88',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 0 8px #00ff88)'
                }}
                style={{
                  filter: 'drop-shadow(0 0 3px #00ff88)',
                }}
              />
              
              <Area
                type="monotone"
                dataKey="current"
                stackId="3"
                stroke="#00ffff"
                strokeWidth={3}
                fill="url(#currentGradient)"
                name="מחיר נוכחי"
                dot={{ fill: '#00ffff', strokeWidth: 2, r: 5 }}
                activeDot={{ 
                  r: 8, 
                  fill: '#00ffff',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 0 12px #00ffff)'
                }}
                style={{
                  filter: 'drop-shadow(0 0 4px #00ffff)',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Analysis Glass Panel */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="glass-panel p-3 rounded-procurement-md bg-procurement-background-card/20">
          <div className="text-center">
            <div className="text-procurement-primary-neon text-lg font-bold">
              {data.length > 0 ? data[data.length - 1].current.toLocaleString() : '0'}₪
            </div>
            <div className="text-procurement-text-muted text-xs">מחיר נוכחי</div>
          </div>
        </div>
        <div className="glass-panel p-3 rounded-procurement-md bg-procurement-background-card/20">
          <div className="text-center">
            <div className="text-procurement-secondary-neon text-lg font-bold">
              {data.length > 0 ? data[data.length - 1].predicted.toLocaleString() : '0'}₪
            </div>
            <div className="text-procurement-text-muted text-xs">חיזוי</div>
          </div>
        </div>
        <div className="glass-panel p-3 rounded-procurement-md bg-procurement-background-card/20">
          <div className="text-center">
            <div className="text-procurement-accent-pink text-lg font-bold">
              {data.length > 0 ? data[data.length - 1].market.toLocaleString() : '0'}₪
            </div>
            <div className="text-procurement-text-muted text-xs">שוק</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTrackingChart;
