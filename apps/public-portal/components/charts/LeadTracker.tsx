import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function LeadTracker({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-64 w-full bg-black/40 rounded-xl p-4 border border-white/5">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Lead Momentum Tracker</h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorLead" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDeficit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '10px', color: '#a1a1aa' }}
                    />
                    <ReferenceLine y={0} stroke="#52525b" strokeDasharray="3 3" />
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
