'use client';

import React, { useEffect, useState } from 'react';
import { getManagedTournaments, getMatchesByTournament, getScorers, assignScorerToMatch, getTournamentTeams, addTeamToTournament, removeTeamFromTournament, createPlayerForTeam, getGlobalTeams } from '@/lib/actions';
import { Card, Button } from '@fgsn/ui';
import { Trophy, Users, Shield, MapPin, Calendar, UserPlus, Activity, CheckCircle2, Layout, Radio, Server, Plus, UserMinus, UserPlus2, LogOut } from 'lucide-react';
import { TeamCreationModal } from '@/components/TeamCreationModal';
import { ScorerProvisionModal } from '@/components/ScorerProvisionModal';

interface UserSession {
    userId: string;
    email: string;
    name: string;
    role: string;
}

export default function ManagerDashboard() {
    const [user, setUser] = useState<UserSession | null>(null);
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<any | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [scorers, setScorers] = useState<any[]>([]);
    const [globalTeams, setGlobalTeams] = useState<any[]>([]);
    const [tournamentTeams, setTournamentTeams] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<'matches' | 'teams'>('matches');
    const [loading, setLoading] = useState(true);
    const [previewMatchId, setPreviewMatchId] = useState<string | null>(null);

    useEffect(() => {
        // Parse token from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            try {
                const userData = JSON.parse(atob(token));
                setUser(userData);
                localStorage.setItem('fgsn_session', token);
                loadTournaments(userData.userId);
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
                    loadTournaments(userData.userId);
                } catch (e) {
                    console.error("Session parse error", e);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        loadScorers();
        loadGlobalTeams();
    }, []);

    async function loadTournaments(userId: string) {
        const data = await getManagedTournaments(userId);
        setTournaments(data);
        setLoading(false);
    }

    async function loadScorers() {
        const data = await getScorers();
        setScorers(data);
    }

    async function loadGlobalTeams() {
        const data = await getGlobalTeams();
        setGlobalTeams(data);
    }

    async function handleSelectTournament(t: any) {
        setSelectedTournament(t);
        const [matchData, teamData] = await Promise.all([
            getMatchesByTournament(t.id),
            getTournamentTeams(t.id)
        ]);
        setMatches(matchData);
        setTournamentTeams(teamData);
    }

    async function handleJoinTeam(teamId: string) {
        if (!selectedTournament) return;
        await addTeamToTournament(selectedTournament.id, teamId);
        setTournamentTeams(await getTournamentTeams(selectedTournament.id));
    }

    async function handleLeaveTeam(teamId: string) {
        if (!selectedTournament) return;
        await removeTeamFromTournament(selectedTournament.id, teamId);
        setTournamentTeams(await getTournamentTeams(selectedTournament.id));
    }

    async function handleAssignScorer(matchId: string, userId: string, role: string) {
        if (userId !== 'REFRESH') {
            await assignScorerToMatch(matchId, userId, role);
        }

        if (selectedTournament) {
            const matchData = await getMatchesByTournament(selectedTournament.id);
            setMatches(matchData);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('fgsn_session');
        window.location.href = 'http://localhost:3000';
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-emerald-500 font-mono uppercase tracking-widest">Initializing Command Uplink...</div>;

    if (!user || (user.role !== 'EVENT_MANAGER' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center min-h-screen bg-zinc-950">
                <Shield className="w-16 h-16 text-red-500 mb-6 opacity-20" />
                <h2 className="text-2xl font-black text-white uppercase italic">Unauthorized Access</h2>
                <p className="text-zinc-500 font-bold mt-2">Operational Command Clearance Required.</p>
                <Button onClick={handleLogout} className="mt-8 !bg-zinc-800 !text-zinc-400 font-black uppercase tracking-widest text-[10px]">Return to Gateway</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-emerald-50 p-8 font-mono">
            <header className="mb-12 border-b border-emerald-500/20 pb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                            Operational <span className="text-emerald-500">Command</span>
                        </h1>
                        <p className="text-emerald-500/60 font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Server className="w-3 h-3" />
                            Field Operations Node: {user.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="px-4 py-2 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
                            <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                System Online
                            </span>
                        </div>
                        <button onClick={handleLogout} className="text-zinc-600 hover:text-red-500 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left: Managed Tournaments */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Designated Zones
                    </h3>
                    {tournaments.length === 0 ? (
                        <div className="p-6 border border-dashed border-emerald-500/20 rounded-xl text-center">
                            <Radio className="w-6 h-6 text-emerald-900 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-emerald-800 uppercase">No active zones assigned.</p>
                        </div>
                    ) : (
                        tournaments.map(t => (
                            <button
                                key={t.id}
                                onClick={() => handleSelectTournament(t)}
                                className={`w-full text-left transition-all group ${selectedTournament?.id === t.id ? 'scale-105 z-10' : ''}`}
                            >
                                <div className={`p-4 rounded-xl border transition-all ${selectedTournament?.id === t.id ? 'bg-emerald-900/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-black/20 border-white/5 hover:border-emerald-500/30'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-1">
                                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{t.category}</span>
                                            <span className="text-[8px] font-black text-zinc-500 mx-1">|</span>
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{t.sport}</span>
                                        </div>
                                        {selectedTournament?.id === t.id && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500" />}
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase truncate">{t.name}</h4>
                                    <div className="text-[9px] text-emerald-500/60 font-bold mt-1 uppercase tracking-tight">
                                        {t.location || 'Remote Site'}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Right: Matches & Assignments */}
                <div className="lg:col-span-3 space-y-6">
                    {!selectedTournament ? (
                        <div className="h-full flex flex-col items-center justify-center border border-dashed border-emerald-500/10 rounded-3xl py-32 bg-emerald-950/5">
                            <Activity className="w-12 h-12 text-emerald-900/50 mb-6" />
                            <p className="text-emerald-800/50 font-bold uppercase tracking-widest text-xs">Awaiting Zone Selection...</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-slide-up">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                    Assignments: <span className="text-emerald-500">{selectedTournament.name}</span>
                                </h2>
                                <div className="flex gap-4">
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-emerald-500/20">
                                        <button
                                            onClick={() => setCurrentTab('matches')}
                                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentTab === 'matches' ? 'bg-emerald-600 text-black shadow-lg shadow-emerald-500/20' : 'text-emerald-500/50 hover:text-emerald-500'}`}
                                        >
                                            Matches
                                        </button>
                                        <button
                                            onClick={() => setCurrentTab('teams')}
                                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentTab === 'teams' ? 'bg-emerald-600 text-black shadow-lg shadow-emerald-500/20' : 'text-emerald-500/50 hover:text-emerald-500'}`}
                                        >
                                            Teams
                                        </button>
                                    </div>
                                    <div className="h-10 w-[1px] bg-emerald-500/10 hidden md:block" />
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Status</div>
                                        <div className="text-xs font-bold text-emerald-400">ACTIVE - GREEN</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Units</div>
                                        <div className="text-xs font-bold text-white">{matches.length} Ops</div>
                                    </div>
                                </div>
                            </div>

                            {currentTab === 'matches' ? (
                                <>
                                    {/* Deployment Form */}
                                    <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6">
                                        <div className="mb-6 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest">New Deployment</h3>
                                        </div>
                                        <form action={async (formData) => {
                                            const { createMatch } = await import('@/lib/actions');
                                            formData.append('tournamentId', selectedTournament.id);
                                            await createMatch(formData);
                                            handleSelectTournament(selectedTournament); // Refresh
                                        }} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            <select
                                                name="sport"
                                                defaultValue={selectedTournament.sport}
                                                className="bg-black/40 border border-emerald-500/20 rounded text-xs font-bold text-emerald-300 px-3 py-2 outline-none focus:border-emerald-500 uppercase cursor-not-allowed opacity-50"
                                                disabled
                                            >
                                                <option value={selectedTournament.sport}>{selectedTournament.sport}</option>
                                            </select>
                                            <input type="hidden" name="sport" value={selectedTournament.sport} />
                                            <input name="venue" required placeholder="SITE / VENUE" className="bg-black/40 border border-emerald-500/20 rounded text-xs font-bold text-emerald-300 px-3 py-2 outline-none focus:border-emerald-500 placeholder:text-emerald-900" />
                                            <input name="startTime" required type="datetime-local" className="bg-black/40 border border-emerald-500/20 rounded text-xs font-bold text-emerald-300 px-3 py-2 outline-none focus:border-emerald-500" />

                                            <div className="md:col-span-2 grid grid-cols-2 gap-2">
                                                <select name="homeTeamId" className="bg-black/40 border border-emerald-500/20 rounded text-xs font-bold text-emerald-300 px-3 py-2 outline-none focus:border-emerald-500 uppercase">
                                                    <option value="">HOME FORCE...</option>
                                                    {tournamentTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                </select>
                                                <select name="awayTeamId" className="bg-black/40 border border-emerald-500/20 rounded text-xs font-bold text-emerald-300 px-3 py-2 outline-none focus:border-emerald-500 uppercase">
                                                    <option value="">AWAY FORCE...</option>
                                                    {tournamentTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                </select>
                                            </div>

                                            <input name="streamUrl" placeholder="YOUTUBE LIVE URL (OPTIONAL)" className="md:col-span-3 bg-black/40 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-300 px-3 py-2 outline-none focus:border-emerald-500 placeholder:text-emerald-900" />

                                            <Button type="submit" className="md:col-span-1 md:col-start-5 !bg-emerald-600 hover:!bg-emerald-500 !text-black font-black uppercase tracking-widest text-[10px]">
                                                Deploy
                                            </Button>
                                        </form>
                                    </div>

                                    {/* Match Grid */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {matches.map(match => (
                                            <div key={match.id} className="group bg-black/20 border border-white/5 hover:border-emerald-500/30 rounded-xl p-4 transition-all">
                                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                                        <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center font-black text-emerald-500 text-xs border border-emerald-500/20">
                                                            {match.sport.substring(0, 3)}
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-black text-white uppercase tracking-tight">
                                                                {match.teams.map((mt: any, i: number) => (
                                                                    <React.Fragment key={mt.id}>
                                                                        {mt.team.name}
                                                                        {i < match.teams.length - 1 && <span className="text-emerald-500/50 text-xs mx-1">VS</span>}
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                            <div className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest flex items-center gap-2">
                                                                {new Date(match.startTime).toLocaleString()}
                                                                <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                                                {match.venue}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                                        <form action={async (formData) => {
                                                            const url = formData.get('streamUrl') as string;
                                                            const { updateMatchStream } = await import('@/lib/actions');
                                                            await updateMatchStream(match.id, url);
                                                            handleSelectTournament(selectedTournament);
                                                        }} className="flex gap-2 items-center">
                                                            <input
                                                                name="streamUrl"
                                                                defaultValue={match.streamUrl || ''}
                                                                placeholder="UPDATE STREAM URL"
                                                                className="bg-emerald-950/20 border border-emerald-500/10 rounded px-3 py-1 text-[8px] font-bold text-emerald-400 outline-none focus:border-emerald-500 w-32 placeholder:text-emerald-900"
                                                            />
                                                            <button type="submit" className="text-[8px] font-black text-emerald-500 hover:text-white uppercase tracking-widest">Update</button>
                                                        </form>

                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => {
                                                                    const url = `http://localhost:3003?matchId=${match.id}`;
                                                                    navigator.clipboard.writeText(url);
                                                                    alert('Tactical Overlay URL copied to clipboard');
                                                                }}
                                                                className="!px-3 !py-1 !text-[9px] !bg-emerald-900/40 !border-emerald-500/20 !text-emerald-500 hover:!bg-emerald-500 hover:!text-black flex items-center gap-2"
                                                            >
                                                                <Radio className="w-3 h-3" /> COPY OVERLAY
                                                            </Button>
                                                            <Button
                                                                onClick={() => setPreviewMatchId(match.id)}
                                                                className="!px-3 !py-1 !text-[9px] !bg-emerald-500/10 !border-emerald-500/30 !text-emerald-400 hover:!bg-emerald-500 hover:!text-black"
                                                            >
                                                                <Layout className="w-3 h-3 mr-2" /> MONITOR
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Simplified Personnel Grid */}
                                                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {['SCORER', 'HOME_SCORER', 'AWAY_SCORER', 'STATS_SCORER'].map((role) => (
                                                        <ScorerAssignmentRow
                                                            key={role}
                                                            label={role.replace('_', ' ')}
                                                            role={role}
                                                            matchId={match.id}
                                                            currentScorer={match.scorers.find((s: any) => s.role === role)}
                                                            availableScorers={scorers}
                                                            onAssign={handleAssignScorer}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-8">
                                    {/* Team Enlistment Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                                <Users className="w-4 h-4" /> Enlisted Forces
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {tournamentTeams.length === 0 ? (
                                                    <div className="p-12 text-center border border-dashed border-emerald-500/10 rounded-2xl">
                                                        <p className="text-[10px] font-black text-emerald-900 uppercase">No forces enlisted</p>
                                                    </div>
                                                ) : (
                                                    tournamentTeams.map(tt => (
                                                        <div key={tt.id} className="bg-black/40 border border-white/5 rounded-xl p-4 flex justify-between items-center group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-emerald-900/20 rounded-lg flex items-center justify-center font-black text-emerald-500 text-xs border border-emerald-500/20">
                                                                    {tt.shortName || tt.name.substring(0, 2)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-black text-white uppercase">{tt.name}</div>
                                                                    <div className="text-[9px] font-bold text-emerald-500/50 uppercase">{tt.players.length} Personnel Registered</div>

                                                                    {/* Quick Player Add */}
                                                                    <form action={async (formData) => {
                                                                        const name = formData.get('name') as string;
                                                                        if (name) {
                                                                            await createPlayerForTeam(tt.id, name, selectedTournament.sport);
                                                                            handleSelectTournament(selectedTournament); // Refresh
                                                                        }
                                                                    }} className="mt-2 flex gap-2">
                                                                        <input
                                                                            name="name"
                                                                            placeholder="+ New Player"
                                                                            className="bg-emerald-950/20 border border-emerald-500/10 rounded px-2 py-0.5 text-[8px] font-bold text-emerald-400 outline-none focus:border-emerald-500 w-24"
                                                                        />
                                                                        <button type="submit" className="text-emerald-500 hover:text-white">
                                                                            <UserPlus2 className="w-3 h-3" />
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2 text-right">
                                                                <button
                                                                    onClick={() => handleLeaveTeam(tt.id)}
                                                                    className="p-1 text-emerald-900 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <UserMinus className="w-4 h-4" />
                                                                </button>
                                                                <div className="flex -space-x-1">
                                                                    {tt.players.slice(0, 5).map((p: any) => (
                                                                        <div key={p.id} title={p.name} className="w-5 h-5 rounded-full bg-emerald-600 border border-black flex items-center justify-center text-[8px] font-black text-black">
                                                                            {p.name.charAt(0)}
                                                                        </div>
                                                                    ))}
                                                                    {tt.players.length > 5 && (
                                                                        <div className="w-5 h-5 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[6px] font-black text-zinc-500">
                                                                            +{tt.players.length - 5}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Plus className="w-4 h-4" /> Available Reserve
                                                </h3>
                                                <TeamCreationModal tournamentId={selectedTournament.id} onCreated={() => { loadGlobalTeams(); handleSelectTournament(selectedTournament); }} />
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2">
                                                {globalTeams.filter(t => !tournamentTeams.find(tt => tt.id === t.id)).map(t => (
                                                    <div key={t.id} className="bg-emerald-900/5 border border-emerald-500/10 rounded-xl p-4 flex justify-between items-center hover:border-emerald-500/30 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-zinc-900/40 rounded-lg flex items-center justify-center font-black text-zinc-600 text-xs border border-white/5">
                                                                {t.shortName || t.name.substring(0, 2)}
                                                            </div>
                                                            <div className="text-sm font-black text-zinc-400 uppercase">{t.name}</div>
                                                        </div>
                                                        <Button
                                                            onClick={() => handleJoinTeam(t.id)}
                                                            className="!px-3 !py-1 !text-[9px] !bg-emerald-600/10 !border-emerald-500/20 !text-emerald-500 hover:!bg-emerald-600 hover:!text-black"
                                                        >
                                                            ENLIST
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {previewMatchId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur animate-fade-in">
                    <div className="w-[90vw] h-[80vh] bg-black border border-emerald-500/30 rounded-none shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col relative">
                        <div className="flex justify-between items-center p-4 bg-emerald-950 border-b border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Tactical Feed</h3>
                                <span className="text-[10px] font-mono text-emerald-600 ml-4 hidden md:inline">http://localhost:3003?matchId={previewMatchId}</span>
                            </div>
                            <button
                                onClick={() => setPreviewMatchId(null)}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors border border-red-500/20"
                            >
                                Terminate Feed
                            </button>
                        </div>
                        <div className="flex-1 bg-black relative overflow-hidden">
                            <iframe
                                src={`http://localhost:3003?matchId=${previewMatchId}`}
                                className="w-[1920px] h-[1080px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] origin-center border-0 pointer-events-none"
                            />
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ScorerAssignmentRow({ label, role, matchId, currentScorer, availableScorers, onAssign }: any) {
    return (
        <div className="space-y-1">
            <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest block">{label}</span>
            {currentScorer ? (
                <div className="bg-emerald-900/20 border border-emerald-500/20 px-2 py-1.5 rounded flex justify-between items-center group/scorer">
                    <span className="text-[10px] font-bold text-emerald-300 truncate">{currentScorer.user.name}</span>
                    <button
                        onClick={() => onAssign(matchId, '', role)}
                        className="text-emerald-500/50 hover:text-red-400 transition-colors opacity-0 group-hover/scorer:opacity-100"
                    >
                        <Shield className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <div className="w-full space-y-2">
                    <select
                        onChange={(e) => onAssign(matchId, e.target.value, role)}
                        className="w-full bg-black/60 border border-emerald-500/10 rounded px-2 py-1.5 text-[10px] font-bold text-emerald-600 outline-none focus:border-emerald-500 focus:text-emerald-300 transition-all uppercase"
                    >
                        <option value="">-- ASSIGN --</option>
                        {availableScorers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-emerald-500/5"></div>
                        <span className="text-[6px] font-black text-emerald-900">OR</span>
                        <div className="h-px flex-1 bg-emerald-500/5"></div>
                    </div>

                    <ScorerProvisionModal matchId={matchId} role={role} onAssigned={() => onAssign(matchId, 'REFRESH', role)} />
                </div>
            )}
        </div>
    );
}
