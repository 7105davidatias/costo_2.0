
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState } from 'react';

interface SupplierData {
  name: string;
  rating: number;
  price: number;
  delivery: number;
  quality: number;
}

interface SupplierChartProps {
  data: SupplierData[];
  type?: 'bar' | 'radar';
  className?: string;
}

// Custom Glass Tooltip
const GlassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border-procurement-primary-neon/30 p-4 shadow-neon-soft rounded-glass backdrop-blur-md max-w-xs">
        <p className="text-procurement-text-primary font-medium mb-2 text-sm">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs mb-1" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {entry.value}
            {entry.name === 'מחיר' ? '₪' : '/10'}
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
    <div className="flex flex-wrap justify-center gap-3 mt-4">
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

const SupplierChart = ({ data, type = 'bar', className = "" }: SupplierChartProps) => {
  const [hoveredSupplier, setHoveredSupplier] = useState<string | null>(null);

  // Transform data for radar chart
  const radarData = data.map(supplier => ({
    supplier: supplier.name,
    דירוג: supplier.rating,
    מחיר: 10 - (supplier.price / 1000), // Invert price (lower is better)
    משלוח: supplier.delivery,
    איכות: supplier.quality
  }));

  const renderBarChart = () => (
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
      <defs>
        {/* Glass Bar Gradients */}
        <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ffff" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#00ffff" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ff88" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#00ff88" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff0080" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#ff0080" stopOpacity={0.3} />
        </linearGradient>
      </defs>

      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="rgba(0, 255, 255, 0.1)"
      />
      <XAxis 
        dataKey="name"
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
        domain={[0, 10]}
      />
      <Tooltip content={<GlassTooltip />} />
      <Legend content={<GlassLegend />} />
      
      <Bar 
        dataKey="rating" 
        name="דירוג"
        fill="url(#ratingGradient)"
        radius={[2, 2, 0, 0]}
        style={{
          filter: 'drop-shadow(0 0 4px #00ffff)'
        }}
      />
      <Bar 
        dataKey="delivery" 
        name="משלוח"
        fill="url(#deliveryGradient)"
        radius={[2, 2, 0, 0]}
        style={{
          filter: 'drop-shadow(0 0 4px #00ff88)'
        }}
      />
      <Bar 
        dataKey="quality" 
        name="איכות"
        fill="url(#qualityGradient)"
        radius={[2, 2, 0, 0]}
        style={{
          filter: 'drop-shadow(0 0 4px #ff0080)'
        }}
      />
    </BarChart>
  );

  const renderRadarChart = () => (
    <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
      <PolarGrid 
        stroke="rgba(0, 255, 255, 0.2)"
        radialLines={true}
      />
      <PolarAngleAxis 
        dataKey="supplier" 
        tick={{ fill: '#00ffff', fontSize: 12 }}
      />
      <PolarRadiusAxis 
        angle={90} 
        domain={[0, 10]}
        tick={{ fill: '#00ffff', fontSize: 10 }}
        axisLine={false}
      />
      <Tooltip content={<GlassTooltip />} />
      
      <Radar 
        name="דירוג" 
        dataKey="דירוג" 
        stroke="#00ffff" 
        fill="#00ffff" 
        fillOpacity={0.1}
        strokeWidth={2}
        dot={{ fill: '#00ffff', strokeWidth: 2, r: 4 }}
        style={{
          filter: 'drop-shadow(0 0 4px #00ffff)'
        }}
      />
      <Radar 
        name="מחיר" 
        dataKey="מחיר" 
        stroke="#00ff88" 
        fill="#00ff88" 
        fillOpacity={0.1}
        strokeWidth={2}
        dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
        style={{
          filter: 'drop-shadow(0 0 4px #00ff88)'
        }}
      />
      <Radar 
        name="משלוח" 
        dataKey="משלוח" 
        stroke="#ff0080" 
        fill="#ff0080" 
        fillOpacity={0.1}
        strokeWidth={2}
        dot={{ fill: '#ff0080', strokeWidth: 2, r: 4 }}
        style={{
          filter: 'drop-shadow(0 0 4px #ff0080)'
        }}
      />
      <Radar 
        name="איכות" 
        dataKey="איכות" 
        stroke="#8000ff" 
        fill="#8000ff" 
        fillOpacity={0.1}
        strokeWidth={2}
        dot={{ fill: '#8000ff', strokeWidth: 2, r: 4 }}
        style={{
          filter: 'drop-shadow(0 0 4px #8000ff)'
        }}
      />
      
      <Legend content={<GlassLegend />} />
    </RadarChart>
  );

  return (
    <div className={`glass-panel p-6 rounded-procurement-xl border border-procurement-accent-pink/20 ${className}`}>
      {/* Glass Container Header */}
      <div className="glass-float mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-procurement-accent-pink rounded-full shadow-neon-strong animate-pulse-glow" />
            <h3 className="text-procurement-text-primary font-semibold text-lg">
              השוואת ספקים
            </h3>
          </div>
          
          {/* Chart Type Toggle */}
          <div className="glass-button rounded-procurement-md p-1">
            <div className="flex gap-1">
              <button
                onClick={() => {}}
                className={`px-3 py-1 text-xs rounded-procurement-sm transition-all duration-300 ${
                  type === 'bar' 
                    ? 'glass-panel bg-procurement-primary-neon/20 text-procurement-primary-neon shadow-neon-soft' 
                    : 'text-procurement-text-muted hover:text-procurement-text-primary'
                }`}
              >
                עמודות
              </button>
              <button
                onClick={() => {}}
                className={`px-3 py-1 text-xs rounded-procurement-sm transition-all duration-300 ${
                  type === 'radar' 
                    ? 'glass-panel bg-procurement-primary-neon/20 text-procurement-primary-neon shadow-neon-soft' 
                    : 'text-procurement-text-muted hover:text-procurement-text-primary'
                }`}
              >
                רדאר
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Glass Container */}
      <div className="glass-panel bg-procurement-background-card/30 backdrop-blur-sm rounded-procurement-lg p-4">
        <div className="h-96 relative">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-procurement-accent-pink/5 via-transparent to-procurement-primary-neon/5 rounded-procurement-lg" />
          
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? renderBarChart() : renderRadarChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performer Glass Panel */}
      <div className="glass-panel mt-4 p-4 rounded-procurement-md bg-procurement-background-card/20">
        <div className="flex items-center justify-between">
          <span className="text-procurement-text-muted text-sm">ספק מוביל:</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-procurement-secondary-neon rounded-full shadow-neon-soft animate-pulse-glow" />
            <span className="text-procurement-secondary-neon font-medium text-sm">
              {data.reduce((best, current) => 
                current.rating > best.rating ? current : best
              ).name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierChart;
