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
  // Check if data is available and valid
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">📊</div>
          <p className="text-muted-foreground text-sm">אין נתוני ספקים זמינים להצגה</p>
          <p className="text-muted-foreground text-xs mt-1">יתכן שהנתונים עדיין נטענים או שאין ספקים מתאימים</p>
        </div>
      </div>
    );
  }

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
    '#00ffff', // cyan neon
    '#00ff88', // green neon  
    '#ffaa00', // yellow neon
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel backdrop-filter backdrop-blur-[25px] bg-black/60 p-4 border border-procurement-primary-neon/40 rounded-glass shadow-neon text-right" dir="rtl">
          <p className="neon-text-primary font-semibold mb-3 text-base">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-base mb-1 font-medium" style={{ color: entry.color }}>
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
          tick={{ fill: '#cbd5e1', fontSize: 14, fontWeight: 600 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fill: '#8892b0', fontSize: 12, fontWeight: 500 }}
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
        <Legend 
          wrapperStyle={{ 
            fontSize: '12px',
            direction: 'rtl',
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
