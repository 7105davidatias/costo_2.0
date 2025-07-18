import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceTrackingChartProps {
  data: { month: string; price: number }[];
}

export default function PriceTrackingChart({ data }: PriceTrackingChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-secondary/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium">{`${label}`}</p>
          <p className="text-secondary">
            {`מחיר: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="hsl(var(--secondary))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: 'hsl(var(--secondary))', strokeWidth: 2 }}
          fill="url(#colorGradient)"
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  );
}
