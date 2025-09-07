
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AvailabilityHeatmapProps {
  data: {
    region: string;
    availability: number;
    suppliers: number;
    avgDelivery: number;
  }[];
}

export default function AvailabilityHeatmap({ data }: AvailabilityHeatmapProps) {
  const getColor = (availability: number) => {
    if (availability >= 90) return '#34d399'; // Green
    if (availability >= 80) return '#fbbf24'; // Yellow
    if (availability >= 70) return '#f87171'; // Orange
    return '#ef4444'; // Red
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium mb-2">{label}</p>
          <p className="text-primary">זמינות: {data.availability}%</p>
          <p className="text-secondary">ספקים: {data.suppliers}</p>
          <p className="text-warning">זמן אספקה: {data.avgDelivery} ימים</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="region" 
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF' }}
        />
        <YAxis 
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="availability" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.availability)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
