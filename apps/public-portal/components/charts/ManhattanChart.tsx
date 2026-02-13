import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ManhattanChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-64 w-full bg-zinc-50 rounded-xl p-4 border border-zinc-100 shadow-sm">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Over Analysis (Manhattan)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="over" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#18181b' }}
                        labelStyle={{ fontSize: '10px', color: '#71717a' }}
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
