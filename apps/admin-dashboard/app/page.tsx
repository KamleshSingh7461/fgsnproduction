'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@fgsn/ui';
import { getStats, getMatches } from '@/lib/actions';
import { Trophy, Activity, Users, Database, Shield, Layout, Zap, Radio, ShieldCheck, Clock } from 'lucide-react';

export default function AdminPage() {
    const [stats, setStats] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [previewMatchId, setPreviewMatchId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const session = localStorage.getItem('fgsn_session');
        if (session) {
            try {
                const userData = JSON.parse(atob(session));
                setUser(userData);
            } catch (e) {
                console.error("Failed to parse session", e);
            }
        }
        loadData();
    }, [router]);

    async function loadData() {
        const [s, m] = await Promise.all([getStats(), getMatches()]);
        setStats(s);
        setMatches(m);
        setLoading(false);
    }

    if (loading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-black uppercase">Initializing Command Center...</div>;

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    return (
        <div className="min-h-screen p-8 bg-zinc-950 text-white animate-fade-in">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">System Live</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Governance Hub</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-4 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-500" /> Strategic Oversight & Personnel Provisioning
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-zinc-600 uppercase mb-1">Local Network</div>
                        <div className="text-xs font-bold text-white uppercase">Port 3000-3005</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats Widgets */}
                <Card variant="glass" className="p-6 relative overflow-hidden group border-indigo-500/10">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Trophy className="w-24 h-24" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Active Tournaments</h3>
                            <p className="text-5xl font-black mt-1 tracking-tighter">{stats?.tournaments || 0}</p>
                        </div>
                        <div className="p-3 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                            <Trophy className="w-6 h-6 text-indigo-400" />
                        </div>
                    </div>
                </Card>

                <Card variant="glass" className="p-6 relative overflow-hidden group border-green-500/10">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Radio className="w-24 h-24" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Live Engagements</h3>
                            <p className="text-5xl font-black mt-1 text-green-400 tracking-tighter">{stats?.liveMatches || 0}</p>
                        </div>
                        <div className="p-3 bg-green-600/10 rounded-2xl border border-green-500/20">
                            <Activity className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </Card>

                <Card variant="glass" className="p-6 relative overflow-hidden group border-purple-500/10">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-24 h-24" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Registered Teams</h3>
                            <p className="text-5xl font-black mt-1 tracking-tighter">{stats?.teams || 0}</p>
                        </div>
                        <div className="p-3 bg-purple-600/10 rounded-2xl border border-purple-500/20">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </Card>

                {/* Main Action Area */}
                <div className="md:col-span-2 space-y-8">
                    <Card variant="solid" className="p-8 bg-zinc-900/50">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                <Layout className="w-5 h-5 text-indigo-400" /> Global Operations Monitor
                            </h2>
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Observing {matches.length} Matches</div>
                        </div>

                        <div className="space-y-6">
                            {matches.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                                    <p className="text-zinc-500 font-bold text-xs uppercase">No active operations detected</p>
                                </div>
                            ) : (
                                matches.map(match => (
                                    <div key={match.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center font-black text-indigo-400 border border-indigo-500/20">
                                                    {match.teams[0]?.team.shortName || match.teams[0]?.team.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">
                                                        {match.teams.map((mt: any, i: number) => (
                                                            <React.Fragment key={mt.id}>
                                                                {mt.team.name}
                                                                {i < match.teams.length - 1 && <span className="text-zinc-700 mx-2">VS</span>}
                                                            </React.Fragment>
                                                        ))}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1.5 focus:outline-none">
                                                        <div className="px-2 py-0.5 bg-zinc-800 rounded text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{match.tournament.name}</div>
                                                        <div className="text-[10px] font-bold text-zinc-600 uppercase flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-2">
                                                <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${match.status === 'live' ? 'bg-green-600/10 border-green-500/30 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                                                    {match.status}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => {
                                                            const url = `http://localhost:3003?matchId=${match.id}`;
                                                            navigator.clipboard.writeText(url);
                                                            alert('Tactical Overlay URL copied to clipboard');
                                                        }}
                                                        className="!px-3 !py-1 !text-[9px] !bg-zinc-800 !border-zinc-700 !text-zinc-400 hover:!bg-zinc-700 hover:!text-white flex items-center gap-2"
                                                    >
                                                        <Radio className="w-3 h-3" /> COPY OVERLAY
                                                    </Button>
                                                    <Button
                                                        onClick={() => setPreviewMatchId(match.id)}
                                                        className="!px-3 !py-1 !text-[9px] !bg-indigo-600/10 !border-indigo-500/30 !text-indigo-400 hover:!bg-indigo-600 hover:!text-white flex items-center gap-2"
                                                    >
                                                        <Layout className="w-3 h-3" /> PREVIEW
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {isSuperAdmin && (
                                            <div className="mt-6 pt-6 border-t border-white/5">
                                                <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <ShieldCheck className="w-3 h-3 text-indigo-400" /> Operational Personnel Oversight
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {match.scorers.length === 0 ? (
                                                        <span className="text-[10px] text-zinc-800 font-bold uppercase italic">No Units Assigned by Manager</span>
                                                    ) : (
                                                        match.scorers.map((s: any) => (
                                                            <div key={s.id} className="text-[10px] bg-indigo-600/5 px-3 py-2 rounded-xl border border-indigo-500/20 font-black text-indigo-400 uppercase tracking-tighter flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-indigo-500/40"></div>
                                                                {s.user.name}
                                                                <span className="text-[8px] opacity-40 ml-1 font-bold">[{s.role}]</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* System Status */}
                <Card variant="outline" className="p-6 h-fit bg-black/20 sticky top-8">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                        <Database className="w-5 h-5 text-indigo-400" /> System Health
                    </h2>
                    <ul className="space-y-4">
                        <HealthItem label="Auth Gate" status="Online" />
                        <HealthItem label="Scoring Engine" status="Online" />
                        <HealthItem label="Overlay Service" status="Online" />
                        <HealthItem label="SQLite Database" status="Connected" />
                    </ul>
                </Card>
            </div>

            {/* Overlay Preview Modal */}
            {previewMatchId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="w-[90vw] h-[80vh] bg-zinc-900 border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
                        <div className="flex justify-between items-center p-4 bg-black border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Broadcast Output</h3>
                                <span className="text-[10px] font-mono text-zinc-600 ml-4 hidden md:inline">http://localhost:3003?matchId={previewMatchId}</span>
                            </div>
                            <button
                                onClick={() => setPreviewMatchId(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <span className="text-xs font-bold text-zinc-500">CLOSE TERMINAL</span>
                            </button>
                        </div>
                        <div className="flex-1 bg-black relative">
                            <iframe
                                src={`http://localhost:3003?matchId=${previewMatchId}`}
                                className="w-[1920px] h-[1080px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] origin-center border-0 pointer-events-none"
                            />
                            <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur text-white text-[10px] font-mono border border-white/10 rounded">
                                Source: Broadcast Overlay Service (Port 3003)
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function HealthItem({ label, status }: { label: string, status: string }) {
    return (
        <li className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter">{status}</span>
            </div>
        </li>
    );
}
