import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ManhattanChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-64 w-full bg-black/40 rounded-xl p-4 border border-white/5">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Over Analysis (Manhattan)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="over" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#fff' }}
                        labelStyle={{ fontSize: '10px', color: '#a1a1aa' }}
                    />
                    <Bar dataKey="runs" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.wickets > 0 ? '#ef4444' : '#3b82f6'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
