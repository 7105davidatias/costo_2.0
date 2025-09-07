
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceTimelineChartProps {
  data: {
    season: string;
    trend: number | null;
    prediction: number;
  }[];
}

export default function PriceTimelineChart({ data }: PriceTimelineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-info/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'trend' ? 'מגמה בפועל' : 'חיזוי'}: {entry.value ? `${entry.value}%` : 'אין נתונים'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="season" 
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF', fontSize: 12 }}
        />
        <YAxis 
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            fontSize: '12px',
            direction: 'rtl',
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="trend" 
          stroke="#60a5fa" 
          fill="#60a5fa" 
          fillOpacity={0.3}
          name="מגמה בפועל"
          connectNulls={false}
        />
        <Area 
          type="monotone" 
          dataKey="prediction" 
          stroke="#34d399" 
          fill="#34d399" 
          fillOpacity={0.2}
          strokeDasharray="5 5"
          name="חיזוי AI"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
