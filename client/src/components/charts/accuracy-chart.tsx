import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AccuracyChartProps {
  data: { label: string; value: number }[];
}

export default function AccuracyChart({ data }: AccuracyChartProps) {
  const COLORS = [
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--destructive))',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium">{payload[0].name}</p>
          <p className="text-primary">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col items-center space-y-2 mt-4" dir="rtl">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-reverse space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
