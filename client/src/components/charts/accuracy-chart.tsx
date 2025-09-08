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
      <div className="backdrop-filter backdrop-blur-[25px] bg-black/60 p-4 border border-primary/20 rounded-lg shadow-md text-right">
        <p className="text-white font-semibold mb-3 text-base">{`שיטה: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-base mb-1 font-medium text-white">
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
        margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
        style={{ direction: 'rtl' }}
      >
        <defs>
          <pattern id="glassGridAccuracy" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="transparent"/>
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <CartesianGrid stroke="url(#glassGridAccuracy)" />
        <XAxis 
          dataKey="method" 
          tick={{ 
            fill: '#ffffff', 
            fontSize: 11,
            fontWeight: 500,
          }}
          stroke="rgba(255, 255, 255, 0.3)"
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis 
          tick={{ 
            fill: '#ffffff', 
            fontSize: 12,
            fontWeight: 500,
          }}
          stroke="rgba(255, 255, 255, 0.3)"
          domain={[70, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            direction: 'rtl', 
            textAlign: 'right',
            paddingTop: '30px',
            color: '#ffffff'
          }}
        />
        <Bar 
          dataKey="accuracy" 
          fill="#4A90E2"
          name="דיוק (%)"
          radius={[4, 4, 0, 0]}
          stroke="#4A90E2"
          strokeWidth={1}
        />
        <Bar 
          dataKey="requests" 
          fill="#E85D75"
          name="מספר דרישות"
          radius={[4, 4, 0, 0]}
          stroke="#E85D75"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}