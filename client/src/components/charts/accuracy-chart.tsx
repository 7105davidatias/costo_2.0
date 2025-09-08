import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { method: 'תלת נקודות', accuracy: 85, requests: 12 },
  { method: 'מבוסס זמן', accuracy: 92, requests: 8 },
  { method: 'השוואתי', accuracy: 78, requests: 15 },
  { method: 'מבוסס שוק', accuracy: 88, requests: 10 },
  { method: 'AI משולב', accuracy: 94, requests: 6 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel backdrop-filter backdrop-blur-[25px] bg-black/60 p-4 border border-procurement-primary-neon/40 rounded-glass shadow-neon text-right">
        <p className="neon-text-primary font-semibold mb-3 text-base">{`חודש: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-base mb-1 font-medium" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AccuracyChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        style={{ direction: 'rtl' }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
        <XAxis 
          dataKey="method" 
          tick={{ 
            fill: '#8892b0', 
            fontSize: 11,
            fontWeight: 500,
          }}
          stroke="rgba(59, 130, 246, 0.3)"
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis 
          tick={{ 
            fill: '#8892b0', 
            fontSize: 12,
            fontWeight: 500,
          }}
          stroke="rgba(59, 130, 246, 0.3)"
          domain={[70, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            direction: 'rtl', 
            textAlign: 'right',
            paddingTop: '15px'
          }}
        />
        <Bar 
          dataKey="accuracy" 
          fill="#00ffff"
          name="דיוק (%)"
          radius={[4, 4, 0, 0]}
          stroke="#00ffff"
          strokeWidth={1}
        />
        <Bar 
          dataKey="requests" 
          fill="#ff0080"
          name="מספר דרישות"
          radius={[4, 4, 0, 0]}
          stroke="#ff0080"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}