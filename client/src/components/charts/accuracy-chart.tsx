
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';

interface AccuracyData {
  label: string;
  value: number;
  color?: string;
}

interface AccuracyChartProps {
  data: AccuracyData[];
  type?: 'pie' | 'bar';
  className?: string;
}

// Cyberpunk Color Palette
const CYBERPUNK_COLORS = [
  '#00ffff', // Cyan
  '#00ff88', // Green
  '#ff0080', // Pink
  '#8000ff', // Purple
  '#ff8000', // Orange
  '#0080ff', // Blue
];

// Custom Glass Tooltip
const GlassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="glass-panel border-procurement-primary-neon/30 p-3 shadow-neon-soft rounded-glass backdrop-blur-md">
        <p className="text-procurement-text-primary font-medium text-sm mb-1">
          {data.name || label}
        </p>
        <p className="text-xs" style={{ color: data.color }}>
          <span className="font-medium">דיוק:</span> {data.value}%
        </p>
      </div>
    );
  }
  return null;
};

// Custom Glass Legend for Pie Chart
const GlassPieLegend = ({ payload }: any) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="glass-button px-3 py-2 rounded-procurement-md hover:shadow-neon-soft transition-all duration-300">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full shadow-neon-soft"
              style={{ 
                backgroundColor: entry.color,
                boxShadow: `0 0 8px ${entry.color}`
              }}
            />
            <div className="text-right">
              <p className="text-procurement-text-primary text-xs font-medium">
                {entry.value}
              </p>
              <p className="text-procurement-text-muted text-xs">
                {entry.payload.value}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Custom Glass Legend for Bar Chart
const GlassBarLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="glass-button px-3 py-1 rounded-procurement-md mx-1">
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

const AccuracyChart = ({ data, type = 'pie', className = "" }: AccuracyChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Add colors to data
  const coloredData = data.map((item, index) => ({
    ...item,
    color: item.color || CYBERPUNK_COLORS[index % CYBERPUNK_COLORS.length]
  }));

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={coloredData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        innerRadius={40}
        paddingAngle={2}
        dataKey="value"
        onMouseEnter={(_, index) => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {coloredData.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color}
            stroke={hoveredIndex === index ? '#ffffff' : 'transparent'}
            strokeWidth={hoveredIndex === index ? 2 : 0}
            style={{
              filter: hoveredIndex === index 
                ? `drop-shadow(0 0 12px ${entry.color})` 
                : `drop-shadow(0 0 4px ${entry.color})`,
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </Pie>
      <Tooltip content={<GlassTooltip />} />
      <Legend content={<GlassPieLegend />} />
    </PieChart>
  );

  const renderBarChart = () => (
    <BarChart data={coloredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="rgba(0, 255, 255, 0.1)"
      />
      <XAxis 
        dataKey="label"
        stroke="#00ffff"
        tick={{ fill: '#00ffff', fontSize: 11 }}
        axisLine={{ stroke: 'rgba(0, 255, 255, 0.3)' }}
        angle={-45}
        textAnchor="end"
        height={80}
      />
      <YAxis 
        stroke="#00ffff"
        tick={{ fill: '#00ffff', fontSize: 12 }}
        axisLine={{ stroke: 'rgba(0, 255, 255, 0.3)' }}
        tickFormatter={(value) => `${value}%`}
      />
      <Tooltip content={<GlassTooltip />} />
      <Legend content={<GlassBarLegend />} />
      <Bar 
        dataKey="value" 
        name="דיוק"
        radius={[4, 4, 0, 0]}
      >
        {coloredData.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color}
            style={{
              filter: `drop-shadow(0 0 6px ${entry.color})`
            }}
          />
        ))}
      </Bar>
    </BarChart>
  );

  return (
    <div className={`glass-panel p-6 rounded-procurement-xl border border-procurement-secondary-neon/20 ${className}`}>
      {/* Glass Container Header */}
      <div className="glass-float mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-procurement-secondary-neon rounded-full shadow-neon-strong animate-pulse-glow" />
          <h3 className="text-procurement-text-primary font-semibold text-lg">
            דיוק אומדנים
          </h3>
        </div>
      </div>

      {/* Chart Glass Container */}
      <div className="glass-panel bg-procurement-background-card/30 backdrop-blur-sm rounded-procurement-lg p-4">
        <div className="h-80 relative">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-procurement-secondary-neon/5 via-transparent to-procurement-primary-neon/5 rounded-procurement-lg" />
          
          <ResponsiveContainer width="100%" height="100%">
            {type === 'pie' ? renderPieChart() : renderBarChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Glass Panel */}
      <div className="glass-panel mt-4 p-3 rounded-procurement-md bg-procurement-background-card/20">
        <div className="flex justify-between items-center text-xs">
          <span className="text-procurement-text-muted">ממוצע כללי:</span>
          <span className="text-procurement-primary-neon font-medium">
            {(data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccuracyChart;
