
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SavingsTrendChartProps {
  data: { month: string; savings: number; target?: number }[];
  showTarget?: boolean;
}

export default function SavingsTrendChart({ data, showTarget = false }: SavingsTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">💰</div>
          <p className="text-muted-foreground text-sm">אין נתוני חיסכון זמינים</p>
          <p className="text-muted-foreground text-xs mt-1">הנתונים יעודכנו עם פעילות רכש נוספת</p>
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
        <div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium">{`${label}`}</p>
          <p className="text-green-400">
            {`חיסכון: ${formatCurrency(payload[0].value)}`}
          </p>
          {showTarget && payload[1] && (
            <p className="text-blue-400">
              {`יעד: ${formatCurrency(payload[1].value)}`}
            </p>
          )}
          {payload.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {`גידול: ${((payload[0].value / (data[0]?.savings || 1) - 1) * 100).toFixed(1)}%`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
          </linearGradient>
          {showTarget && (
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          )}
        </defs>
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
        
        {showTarget && (
          <Area
            type="monotone"
            dataKey="target"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#targetGradient)"
            strokeDasharray="5 5"
          />
        )}
        
        <Area
          type="monotone"
          dataKey="savings"
          stroke="#10b981"
          strokeWidth={3}
          fill="url(#savingsGradient)"
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
