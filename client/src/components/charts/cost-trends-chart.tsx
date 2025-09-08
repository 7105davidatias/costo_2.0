
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CostTrendsData {
  month: string;
  cost: number;
  predicted?: number;
  savings?: number;
}

interface CostTrendsChartProps {
  data: CostTrendsData[];
  className?: string;
}

// Custom Glass Tooltip Component
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

// Custom Glass Legend Component
const GlassLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center items-center gap-6 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="glass-button px-3 py-1 rounded-procurement-md">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full shadow-neon-soft"
              style={{ backgroundColor: entry.color }}
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

const CostTrendsChart = ({ data, className = "" }: CostTrendsChartProps) => {
  return (
    <div className={`glass-panel p-6 rounded-procurement-xl border border-procurement-primary-neon/20 ${className}`}>
      {/* Glass Container Header */}
      <div className="glass-float mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-procurement-primary-neon rounded-full shadow-neon-strong animate-pulse-glow" />
          <h3 className="text-procurement-text-primary font-semibold text-lg">
            מגמות עלויות
          </h3>
        </div>
      </div>

      {/* Chart Glass Container */}
      <div className="glass-panel bg-procurement-background-card/30 backdrop-blur-sm rounded-procurement-lg p-4">
        <div className="h-80 relative">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-procurement-primary-neon/5 via-transparent to-procurement-secondary-neon/5 rounded-procurement-lg" />
          
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {/* Glass Grid */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(0, 255, 255, 0.1)"
                strokeWidth={1}
              />
              
              {/* Glass Axes */}
              <XAxis 
                dataKey="month"
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

              {/* Neon Lines with Glow Effects */}
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#00ffff"
                strokeWidth={3}
                name="עלות בפועל"
                dot={{ 
                  fill: '#00ffff', 
                  strokeWidth: 2, 
                  r: 6,
                  filter: 'drop-shadow(0 0 8px #00ffff)'
                }}
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
              
              {data.some(d => d.predicted) && (
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#00ff88"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="חיזוי"
                  dot={{ 
                    fill: '#00ff88', 
                    strokeWidth: 2, 
                    r: 4,
                    filter: 'drop-shadow(0 0 6px #00ff88)'
                  }}
                  style={{
                    filter: 'drop-shadow(0 0 3px #00ff88)',
                  }}
                />
              )}

              {data.some(d => d.savings) && (
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#ff0080"
                  strokeWidth={2}
                  name="חיסכון"
                  dot={{ 
                    fill: '#ff0080', 
                    strokeWidth: 2, 
                    r: 4,
                    filter: 'drop-shadow(0 0 6px #ff0080)'
                  }}
                  style={{
                    filter: 'drop-shadow(0 0 3px #ff0080)',
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CostTrendsChart;
