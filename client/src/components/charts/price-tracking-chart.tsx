
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'שבוע 1', currentPrice: 1200, marketAverage: 1150, predicted: 1180 },
  { week: 'שבוע 2', currentPrice: 1180, marketAverage: 1160, predicted: 1190 },
  { week: 'שבוע 3', currentPrice: 1220, marketAverage: 1170, predicted: 1200 },
  { week: 'שבוע 4', currentPrice: 1190, marketAverage: 1165, predicted: 1210 },
  { week: 'שבוע 5', currentPrice: 1210, marketAverage: 1175, predicted: 1220 },
  { week: 'שבוע 6', currentPrice: 1230, marketAverage: 1180, predicted: 1240 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 border border-procurement-border-glass rounded-lg shadow-glass">
        <p className="neon-text-primary font-semibold mb-2">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-procurement-text-primary text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ₪${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PriceTrackingChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        style={{ direction: 'rtl' }}
      >
        <defs>
          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00ffff" stopOpacity={0.05}/>
          </linearGradient>
          <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00ff88" stopOpacity={0.05}/>
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ffaa00" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
        <XAxis 
          dataKey="week" 
          tick={{ 
            fill: '#8892b0', 
            fontSize: 12,
            fontWeight: 500,
          }}
          stroke="rgba(59, 130, 246, 0.3)"
        />
        <YAxis 
          tick={{ 
            fill: '#8892b0', 
            fontSize: 12,
            fontWeight: 500,
          }}
          stroke="rgba(59, 130, 246, 0.3)"
          tickFormatter={(value) => `₪${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            direction: 'rtl', 
            textAlign: 'right',
            paddingTop: '15px'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="currentPrice" 
          stroke="#00ffff" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorCurrent)"
          name="מחיר נוכחי"
        />
        <Area 
          type="monotone" 
          dataKey="marketAverage" 
          stroke="#00ff88" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorMarket)"
          name="ממוצע שוק"
        />
        <Area 
          type="monotone" 
          dataKey="predicted" 
          stroke="#ffaa00" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorPredicted)"
          name="חיזוי"
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
