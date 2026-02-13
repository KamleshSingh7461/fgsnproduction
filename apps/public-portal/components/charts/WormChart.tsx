import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function WormChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-64 w-full bg-zinc-50 rounded-xl p-4 border border-zinc-100 shadow-sm">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Run Rate Comparison (Worm)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="over" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '10px', color: '#71717a' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="home" stroke="#4f46e5" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="away" stroke="#db2777" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
