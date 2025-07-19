import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SupplierChartProps {
  data: {
    supplier: string;
    price: number;
    quality: number;
    delivery: number;
    service: number;
    reliability: number;
  }[];
}

export default function SupplierChart({ data }: SupplierChartProps) {
  // Transform data for radar chart
  const categories = ['מחיר', 'איכות', 'זמן אספקה', 'שירות', 'אמינות'];
  const radarData = categories.map(category => {
    const categoryData: any = { category };
    data.forEach((supplier, index) => {
      const categoryKey = {
        'מחיר': 'price',
        'איכות': 'quality',
        'זמן אספקה': 'delivery',
        'שירות': 'service',
        'אמינות': 'reliability',
      }[category] as keyof typeof supplier;
      
      categoryData[supplier.supplier] = supplier[categoryKey];
    });
    return categoryData;
  });

  const colors = [
    '#60a5fa',
    '#34d399', 
    '#fbbf24',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="hsl(var(--muted))" />
        <PolarAngleAxis 
          dataKey="category" 
          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
        />
        {data.map((supplier, index) => (
          <Radar
            key={supplier.supplier}
            name={supplier.supplier}
            dataKey={supplier.supplier}
            stroke={colors[index]}
            fill={colors[index]}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
