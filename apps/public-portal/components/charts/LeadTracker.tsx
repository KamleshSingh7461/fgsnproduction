import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function LeadTracker({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-64 w-full bg-zinc-50 rounded-xl p-4 border border-zinc-100 shadow-sm">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Lead Momentum Tracker</h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorLead" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDeficit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#db2777" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '10px', color: '#71717a' }}
                    />
                    <ReferenceLine y={0} stroke="#e4e4e7" strokeDasharray="3 3" />
                    <Area
                        type="monotone"
                        dataKey="diff"
                        stroke="#8b5cf6"
                        fill="url(#colorLead)"
                        fillOpacity={1}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
