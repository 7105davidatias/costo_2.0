import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceTrackingChartProps {
  data: { month: string; price: number }[];
}

export default function PriceTrackingChart({ data }: PriceTrackingChartProps) {
  // Check if data is available and valid
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">📈</div>
          <p className="text-muted-foreground text-sm">אין נתוני מחירים היסטוריים זמינים</p>
          <p className="text-muted-foreground text-xs mt-1">ייתכן שהמוצר חדש או שהנתונים עדיין נטענים</p>
        </div>
      </div>
    );
  }

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
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF' }}
        />
        <YAxis 
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF' }}
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#34d399" 
          strokeWidth={3}
          dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#34d399', strokeWidth: 2 }}
          fill="url(#colorGradient)"
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  );
}
