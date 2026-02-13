'use client';

import React, { useEffect, useState } from 'react';
import { getAssignedMatchesForScorer } from '@/lib/actions';
import { Card, Button } from '@fgsn/ui';
import { Zap, Clock, MapPin, Trophy, ExternalLink, ShieldCheck, LogOut, Server } from 'lucide-react';

interface UserSession {
    userId: string;
    email: string;
    name: string;
    role: string;
}

export default function ScorerDashboard() {
    const [user, setUser] = useState<UserSession | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Parse token from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            try {
                const userData = JSON.parse(atob(token));
                setUser(userData);
                localStorage.setItem('fgsn_session', token);
                loadMatches(userData.userId);
                // Clean up URL
                window.history.replaceState({}, '', window.location.pathname);
            } catch (e) {
                console.error("Token parse error", e);
            }
        } else {
            const session = localStorage.getItem('fgsn_session');
            if (session) {
                try {
                    const userData = JSON.parse(atob(session));
                    setUser(userData);
                    loadMatches(userData.userId);
                } catch (e) {
                    console.error("Session parse error", e);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
    }, []);

    async function loadMatches(userId: string) {
        const data = await getAssignedMatchesForScorer(userId);
        setMatches(data);
        setLoading(false);
    }

    const handleLogout = () => {
        localStorage.removeItem('fgsn_session');
        window.location.href = 'http://localhost:3000';
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-yellow-500 font-mono uppercase tracking-widest">Synchronizing Personnel Data...</div>;

    if (!user || (user.role !== 'SCORER' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center min-h-screen bg-zinc-950">
                <ShieldCheck className="w-16 h-16 text-red-500 mb-6 opacity-20" />
                <h2 className="text-2xl font-black text-white uppercase italic">Access Denied</h2>
                <p className="text-zinc-500 font-bold mt-2">Personnel Assignment Required.</p>
                <Button onClick={handleLogout} className="mt-8 !bg-zinc-800 !text-zinc-400 font-black uppercase tracking-widest text-[10px]">Return to Gateway</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-yellow-50 p-8 font-mono">
            <header className="mb-12 border-b border-yellow-500/20 pb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                            Personnel <span className="text-yellow-500">Hub</span>
                        </h1>
                        <p className="text-yellow-500/60 font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Server className="w-3 h-3" />
                            Active Unit: {user.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="px-4 py-2 bg-yellow-950/30 border border-yellow-500/30 rounded-lg">
                            <span className="text-xs font-black text-yellow-400 tracking-widest uppercase flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                Deployment Active
                            </span>
                        </div>
                        <button onClick={handleLogout} className="text-zinc-600 hover:text-red-500 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2 mb-8">
                    <Zap className="w-4 h-4" /> Assigned Missions
                </h2>

                {matches.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-yellow-500/10 rounded-3xl bg-yellow-950/5">
                        <Trophy className="w-12 h-12 text-yellow-900/30 mx-auto mb-6" />
                        <p className="text-yellow-900/50 font-black uppercase tracking-widest text-xs">No active assignments found for this unit.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {matches.map(match => (
                            <div key={match.id} className="group relative bg-black/40 border border-white/5 hover:border-yellow-500/30 rounded-3xl p-8 transition-all overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center font-black text-yellow-500 border border-yellow-500/20">
                                            {match.sport.substring(0, 3).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {match.teams.map((mt: any, i: number) => (
                                                    <React.Fragment key={mt.id}>
                                                        <span className="text-xl font-black uppercase tracking-tight text-white">{mt.team.name}</span>
                                                        {i < match.teams.length - 1 && <span className="text-zinc-700 font-black px-1">VS</span>}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                                    <Clock className="w-3 h-3" /> {new Date(match.startTime).toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                                    <MapPin className="w-3 h-3" /> {match.venue}
                                                </div>
                                                <div className="px-2 py-0.5 bg-zinc-800 rounded text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                                                    {match.tournament.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            const token = localStorage.getItem('fgsn_session');
                                            window.open(`http://localhost:3002?matchId=${match.id}${token ? `&token=${token}` : ''}`, '_blank');
                                        }}
                                        className="!px-8 !py-4 !rounded-2xl !bg-yellow-500 !text-black font-black uppercase tracking-widest text-xs hover:!bg-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.2)] group-hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" /> Launch Interface
                                    </Button>
                                </div>

                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ShieldCheck className="w-12 h-12 text-yellow-500/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
