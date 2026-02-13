import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function WormChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-64 w-full bg-black/40 rounded-xl p-4 border border-white/5">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Run Rate Comparison (Worm)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="over" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '10px', color: '#a1a1aa' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="home" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="away" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
