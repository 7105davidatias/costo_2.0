
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
      <div className="backdrop-filter backdrop-blur-[25px] bg-black/60 p-4 border border-primary/20 rounded-lg shadow-md text-right">
        <p className="text-white font-semibold mb-3 text-base">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-base mb-1 font-medium text-white">
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
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        style={{ direction: 'rtl' }}
      >
        <defs>
          <pattern id="glassGrid" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="transparent"/>
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <CartesianGrid stroke="url(#glassGrid)" />
        <XAxis 
          dataKey="month" 
          tick={{ 
            fill: '#ffffff', 
            fontSize: 14,
            fontWeight: 600,
          }}
          stroke="rgba(255, 255, 255, 0.3)"
          tickMargin={15}
          height={60}
        />
        <YAxis 
          tick={{ 
            fill: '#ffffff', 
            fontSize: 14,
            fontWeight: 600,
          }}
          stroke="rgba(255, 255, 255, 0.3)"
          tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
          tickMargin={15}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            direction: 'rtl', 
            textAlign: 'right',
            paddingTop: '35px',
            color: '#ffffff'
          }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="#4A90E2"
          strokeWidth={2}
          dot={{ fill: '#4A90E2', strokeWidth: 1, r: 4 }}
          activeDot={{ r: 6, stroke: '#4A90E2', strokeWidth: 1, fill: '#4A90E2' }}
          name="עלות בפועל"
        />
        <Line 
          type="monotone" 
          dataKey="estimated" 
          stroke="#50C878"
          strokeWidth={2}
          dot={{ fill: '#50C878', strokeWidth: 1, r: 4 }}
          activeDot={{ r: 6, stroke: '#50C878', strokeWidth: 1, fill: '#50C878' }}
          name="עלות מוערכת"
        />
        <Line 
          type="monotone" 
          dataKey="savings" 
          stroke="#FF8C42"
          strokeWidth={2}
          dot={{ fill: '#FF8C42', strokeWidth: 1, r: 4 }}
          activeDot={{ r: 6, stroke: '#FF8C42', strokeWidth: 1, fill: '#FF8C42' }}
          name="חיסכון"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
