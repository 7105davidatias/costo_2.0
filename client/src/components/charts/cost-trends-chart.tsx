
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'ינואר', actual: 450000, estimated: 420000, savings: 30000 },
  { month: 'פברואר', actual: 520000, estimated: 510000, savings: 10000 },
  { month: 'מרץ', actual: 380000, estimated: 400000, savings: -20000 },
  { month: 'אפריל', actual: 620000, estimated: 590000, savings: 30000 },
  { month: 'מאי', actual: 480000, estimated: 470000, savings: 10000 },
  { month: 'יוני', actual: 720000, estimated: 680000, savings: 40000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 border border-procurement-border-glass rounded-lg shadow-glass">
        <p className="neon-text-primary font-semibold mb-2">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-procurement-text-primary text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ₪${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CostTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        style={{ direction: 'rtl' }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
        <XAxis 
          dataKey="month" 
          tick={{ 
            fill: '#8892b0', 
            fontSize: 12,
            fontWeight: 500,
          }}
          stroke="rgba(59, 130, 246, 0.3)"
          tickMargin={10}
        />
        <YAxis 
          tick={{ 
            fill: '#8892b0', 
            fontSize: 12,
            fontWeight: 500,
          }}
          stroke="rgba(59, 130, 246, 0.3)"
          tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
          tickMargin={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            direction: 'rtl', 
            textAlign: 'right',
            paddingTop: '20px'
          }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="#00ffff"
          strokeWidth={3}
          dot={{ fill: '#00ffff', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#00ffff', strokeWidth: 2, fill: '#00ffff' }}
          name="עלות בפועל"
        />
        <Line 
          type="monotone" 
          dataKey="estimated" 
          stroke="#00ff88"
          strokeWidth={3}
          dot={{ fill: '#00ff88', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#00ff88', strokeWidth: 2, fill: '#00ff88' }}
          name="עלות מוערכת"
        />
        <Line 
          type="monotone" 
          dataKey="savings" 
          stroke="#ffaa00"
          strokeWidth={3}
          dot={{ fill: '#ffaa00', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#ffaa00', strokeWidth: 2, fill: '#ffaa00' }}
          name="חיסכון"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
