
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CompetitiveScatterChartProps {
  data: {
    name: string;
    price: number;
    quality: number;
    reliability: number;
    size: number;
  }[];
}

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

export default function CompetitiveScatterChart({ data }: CompetitiveScatterChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium mb-2">{data.name}</p>
          <p className="text-primary">מחיר: {formatCurrency(data.price)}</p>
          <p className="text-secondary">איכות: {(data.quality / 20).toFixed(1)}/5</p>
          <p className="text-warning">אמינות: {data.reliability.toFixed(0)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          type="number" 
          dataKey="price" 
          name="מחיר"
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF' }}
          tickFormatter={(value) => `₪${(value/1000).toFixed(0)}K`}
        />
        <YAxis 
          type="number" 
          dataKey="quality" 
          name="איכות"
          stroke="#FFFFFF"
          tick={{ fill: '#FFFFFF' }}
          tickFormatter={(value) => `${(value/20).toFixed(1)}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter name="ספקים" data={data} fill="#60a5fa">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
