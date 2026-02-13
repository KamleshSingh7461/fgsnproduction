'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MatchStateDTO, BasketballStateDTO, CricketStateDTO, FootballStateDTO, VolleyballStateDTO } from '@fgsn/dtos';
import { Card, Button } from '@fgsn/ui';

import { Trophy, Activity, ChevronLeft, Calendar, MapPin, TrendingUp, BarChart3, Send, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import { WormChart } from './charts/WormChart';
import { ManhattanChart } from './charts/ManhattanChart';
import { LeadTracker } from './charts/LeadTracker';
import { postComment } from '@/lib/actions';

export function MatchView({ initialMatch }: { initialMatch: any }) {
    // Transform initial Prisma match to MatchStateDTO format if needed
    const hydrateMatch = (raw: any): MatchStateDTO => {
        // If it's already a DTO (from socket), return it
        if (raw.scoreSummary && (raw as any).meta) return raw as MatchStateDTO;

        // Parse liveData if it's a string
        const parsedLiveData = typeof raw.liveData === 'string' ? JSON.parse(raw.liveData) : raw.liveData;

        // Map teams
        const homeTeam = raw.teams?.find((t: any) => t.slotLabel === 'Home' || t.displayOrder === 0)?.team;
        const awayTeam = raw.teams?.find((t: any) => t.slotLabel === 'Away' || t.displayOrder === 1)?.team;

        return {
            matchId: raw.id,
            sport: raw.sport as any,
            status: raw.status as any,
            scoreSummary: parsedLiveData?.scoreSummary || { home: "0", away: "0" },
            liveData: parsedLiveData?.liveData || {},
            meta: {
                tournamentName: raw.tournament?.name || 'Tournament Area',
                venue: { name: raw.venue || 'Indoor Stadium' },
                startTime: raw.startTime ? new Date(raw.startTime).toISOString() : new Date().toISOString(),
                officials: { referees: [], umpires: [], scorer: '' }
            },
            // Convenience properties for UI template compatibility
            tournament: raw.tournament ? { id: raw.tournament.id, name: raw.tournament.name } : undefined,
            homeTeam: homeTeam ? { id: homeTeam.id, name: homeTeam.name, shortName: homeTeam.shortName || '' } : undefined,
            awayTeam: awayTeam ? { id: awayTeam.id, name: awayTeam.name, shortName: awayTeam.shortName || '' } : undefined,
        } as any;
    };

    const [match, setMatch] = useState<MatchStateDTO>(hydrateMatch(initialMatch));
    const [comments, setComments] = useState<any[]>(initialMatch.comments || []);
    const [userName, setUserName] = useState<string>('');
    const [newComment, setNewComment] = useState('');
    const [isJoiningChat, setIsJoiningChat] = useState(!userName);
    const socketRef = useRef<Socket | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedName = localStorage.getItem('fgsn_user_name');
        if (savedName) {
            setUserName(savedName);
            setIsJoiningChat(false);
        }

        socketRef.current = io('http://localhost:3005');
        socketRef.current.emit('join-match', initialMatch.id);

        socketRef.current.on('match-updated', (data: MatchStateDTO) => {
            setMatch(hydrateMatch(data));
        });

        socketRef.current.on('new-comment', (comment: any) => {
            setComments(prev => [comment, ...prev]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [initialMatch.id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleJoinChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            localStorage.setItem('fgsn_user_name', userName);
            setIsJoiningChat(false);
        }
    };

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !userName) return;

        const content = newComment;
        setNewComment('');

        // Optimistic UI
        const tempId = Math.random().toString();
        const optimisticComment = { id: tempId, userName, content, createdAt: new Date() };
        // setComments(prev => [optimisticComment, ...prev]); // Will be handled by socket broadcast if implemented, else manually

        const savedComment = await postComment(initialMatch.id, userName, content);
        if (socketRef.current) {
            socketRef.current.emit('send-comment', { matchId: initialMatch.id, ...savedComment });
        }
    };

    const liveMatch = match as any;

    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const streamId = getYoutubeId(initialMatch.streamUrl);

    // Data Preparation for Charts (same logic)
    const prepareCricketData = (data: CricketStateDTO) => {
        const wormData = data.inningsTranscript?.map(o => ({
            over: o.overNumber,
            home: o.totalScoreAtEnd
        })) || [];

        const manhattanData = data.inningsTranscript?.map(o => ({
            over: o.overNumber,
            runs: o.runsConceded,
            wickets: o.wicketsLost
        })) || [];

        return { wormData, manhattanData };
    };

    const prepareBasketballData = (data: BasketballStateDTO) => {
        const leadData = data.matchFlow.scoreHistory?.map(s => ({
            time: s.timestamp,
            diff: s.homeScore - s.awayScore
        })) || [];
        return { leadData };
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6 selection:bg-indigo-500/30">
            {/* Minimal Header */}
            <div className="max-w-[1600px] mx-auto flex justify-between items-center mb-6">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                    <ChevronLeft className="w-4 h-4" /> Back to matches
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-zinc-600" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{liveMatch.tournament?.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Stream & Charts */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Stream Container */}
                    <div className="relative aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                        {streamId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${streamId}?autoplay=1`}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
                                <Activity className="w-16 h-16 mb-4 opacity-20 animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-[0.2em]">Waiting for stream transmission...</p>
                            </div>
                        )}
                        <div className="absolute top-6 left-6 flex gap-3 pointer-events-none">
                            <span className="px-3 py-1 bg-red-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-500/20">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                Live Stream
                            </span>
                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                                {liveMatch.sport}
                            </span>
                        </div>
                    </div>

                    {/* Desktop Scoreboard (Condensed) */}
                    {liveMatch.sport === 'volleyball' ? (
                        <Card variant="solid" className="p-8 bg-zinc-900/40 border-white/5 hidden md:block relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-red-900/10 pointer-events-none" />
                            <div className="flex items-center justify-between px-8 relative z-10">
                                <div className="text-center w-64 group">
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-2xl font-black italic mb-3 mx-auto group-hover:border-blue-500/50 transition-all">
                                        {liveMatch.homeTeam?.shortName || 'HOME'}
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-tighter mb-2">{liveMatch.homeTeam?.name}</div>
                                    <div className="text-sm font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block">
                                        SETS: {(liveMatch.liveData as VolleyballStateDTO)?.sets?.filter(s => s.home > s.away).length || 0}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-10">
                                        <div className="text-7xl font-black text-white tabular-nums">{(liveMatch.liveData as VolleyballStateDTO)?.score?.home || 0}</div>
                                        <div className="flex flex-col items-center">
                                            <div className="bg-yellow-500 text-black font-black px-4 py-1 rounded text-[10px] uppercase tracking-widest mb-3 shadow-lg shadow-yellow-500/20">
                                                Set {(liveMatch.liveData as VolleyballStateDTO)?.currentSet || 1}
                                            </div>
                                            <div className="text-zinc-600 text-3xl font-black">:</div>
                                        </div>
                                        <div className="text-7xl font-black text-zinc-500 tabular-nums">{(liveMatch.liveData as VolleyballStateDTO)?.score?.away || 0}</div>
                                    </div>
                                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                                        {(liveMatch.liveData as VolleyballStateDTO)?.sets?.map((s, i) => (
                                            <div key={i} className="flex flex-col items-center px-3 py-1 bg-black/40 rounded border border-white/5 min-w-[60px]">
                                                <span className="text-[7px] font-black text-zinc-600 uppercase mb-1">Set {i + 1}</span>
                                                <span className="text-[10px] font-mono font-bold text-zinc-400">{s.home} - {s.away}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center w-64 group">
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-2xl font-black italic mb-3 mx-auto group-hover:border-red-500/50 transition-all text-zinc-600">
                                        {liveMatch.awayTeam?.shortName || 'AWAY'}
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-tighter text-zinc-500 mb-2">{liveMatch.awayTeam?.name}</div>
                                    <div className="text-sm font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 inline-block">
                                        SETS: {(liveMatch.liveData as VolleyballStateDTO)?.sets?.filter(s => s.away > s.home).length || 0}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card variant="solid" className="p-8 bg-zinc-900/40 border-white/5 hidden md:block">
                            <div className="flex items-center justify-between px-12">
                                <div className="text-center group">
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-2xl font-black italic mb-3 group-hover:border-indigo-500/50 transition-all">
                                        {liveMatch.homeTeam?.shortName || liveMatch.homeTeam?.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-tighter">{liveMatch.homeTeam?.name}</div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-8 text-6xl font-black tracking-tighter tabular-nums">
                                        <span className="text-white">{liveMatch.scoreSummary?.home || 0}</span>
                                        <span className="text-zinc-800 text-3xl">:</span>
                                        <span className="text-zinc-500">{liveMatch.scoreSummary?.away || 0}</span>
                                    </div>
                                    <div className="mt-4 px-4 py-1 bg-black rounded-lg border border-white/5">
                                        <span className="text-sm font-mono font-bold text-indigo-400">{(liveMatch.liveData as any)?.clock?.gameTime || 'LIVE'}</span>
                                    </div>
                                </div>

                                <div className="text-center group">
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-2xl font-black italic mb-3 group-hover:border-indigo-500/50 transition-all text-zinc-600">
                                        {liveMatch.awayTeam?.shortName || liveMatch.awayTeam?.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-tighter text-zinc-500">{liveMatch.awayTeam?.name}</div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Volleyball Court View */}
                    {liveMatch.sport === 'volleyball' && (
                        <Card variant="glass" className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Court Positions</span>
                                </div>
                                {(liveMatch.liveData as VolleyballStateDTO)?.servingTeam && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black text-zinc-700 uppercase">Serving</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${(liveMatch.liveData as VolleyballStateDTO).servingTeam === 'home' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {(liveMatch.liveData as VolleyballStateDTO).servingTeam === 'home' ? liveMatch.homeTeam?.name : liveMatch.awayTeam?.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-12 max-w-4xl mx-auto">
                                <VolleyballCourt teamId="home" data={liveMatch.liveData as VolleyballStateDTO} />
                                <VolleyballCourt teamId="away" data={liveMatch.liveData as VolleyballStateDTO} />
                            </div>
                        </Card>
                    )}

                    {/* Charts (Responsive Grid) */}
                    {match.sport === 'cricket' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card variant="glass" className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Run Momentum</span>
                                </div>
                                <WormChart data={prepareCricketData(match.liveData as CricketStateDTO).wormData} />
                            </Card>
                            <Card variant="glass" className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <BarChart3 className="w-4 h-4 text-orange-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Innings Breakdown</span>
                                </div>
                                <ManhattanChart data={prepareCricketData(match.liveData as CricketStateDTO).manhattanData} />
                            </Card>
                        </div>
                    )}
                </div>

                {/* Right Column: Chat & Live Feed */}
                <div className="lg:col-span-4 space-y-8 flex flex-col h-[calc(100vh-100px)] sticky top-6">
                    {/* Chat Section */}
                    <Card variant="solid" className="flex-1 bg-zinc-900/40 border-white/5 flex flex-col overflow-hidden relative">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-indigo-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Community Chat</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
                            </div>
                        </div>

                        {isJoiningChat ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-sm">
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 text-indigo-500 border border-indigo-500/20">
                                    <User className="w-8 h-8" />
                                </div>
                                <h4 className="text-sm font-black uppercase italic mb-2">Join the Conversation</h4>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-8">Set your handle to start chatting</p>
                                <form onSubmit={handleJoinChat} className="w-full space-y-4">
                                    <input
                                        required
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="ENTER YOUR HANDLE"
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-center outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-800"
                                    />
                                    <Button type="submit" className="w-full !bg-white !text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl py-3 shadow-xl">
                                        Activate Chat
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <>
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse custom-scrollbar">
                                    <div className="space-y-4">
                                        {comments.map((c) => (
                                            <div key={c.id} className="flex flex-col gap-1 group animate-fade-in">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{c.userName}</span>
                                                    <span className="text-[7px] text-zinc-600 font-bold">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 text-[11px] font-medium leading-relaxed group-hover:bg-white/10 transition-colors">
                                                    {c.content}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-white/5 bg-black/40">
                                    <form onSubmit={handleSendComment} className="flex gap-2">
                                        <input
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="SAY SOMETHING..."
                                            className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-800"
                                        />
                                        <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20 group">
                                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </form>
                                    <div className="mt-3 flex items-center justify-between px-1">
                                        <span className="text-[8px] font-black text-zinc-700 uppercase">Logged in as: <span className="text-zinc-500">{userName}</span></span>
                                        <button onClick={() => setIsJoiningChat(true)} className="text-[8px] font-black text-zinc-700 hover:text-indigo-400 uppercase">Change</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>

                    {/* Compact Live Feed */}
                    <Card variant="glass" className="h-[250px] flex flex-col p-0">
                        <div className="p-4 border-b border-white/5 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-red-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Highlights</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {(liveMatch.liveData as any)?.events?.length > 0 ? (
                                (liveMatch.liveData as any).events.slice().reverse().map((e: any, i: number) => (
                                    <div key={i} className="flex gap-3 text-[10px]">
                                        <span className="font-black text-indigo-500">{e.minute}</span>
                                        <span className="font-bold text-zinc-400 uppercase tracking-tighter">{e.description}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[9px] text-zinc-800 font-bold uppercase tracking-[0.2em] text-center pt-8">Establishing Uplink...</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{value}</span>
        </div>
    );
}

function VolleyballCourt({ teamId, data }: { teamId: 'home' | 'away', data: VolleyballStateDTO }) {
    const team = data.teams?.[teamId];
    const roster = data.rotations?.[teamId] || [];
    if (!team) return null;

    // Volleyball Zones: 4 3 2 (Net) / 5 6 1
    const grid = [
        roster[3], roster[2], roster[1],
        roster[4], roster[5], roster[0]
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center">
                <span className={`text-[10px] font-black uppercase tracking-widest ${teamId === 'home' ? 'text-blue-400' : 'text-red-400'}`}>
                    {team.name}
                </span>
            </div>
            <div className={`grid grid-cols-3 gap-2 p-4 rounded-2xl border-2 transition-all ${data.servingTeam === teamId ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/5 bg-white/5'}`}>
                {grid.map((pid, i) => {
                    const player = team.players.find(p => p.id === pid);
                    const isLibero = (player as any)?.position === 'L';

                    return (
                        <div
                            key={i}
                            className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all relative ${isLibero ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-black/20 border-white/5'}`}
                        >
                            <span className="text-[8px] font-black text-zinc-500 mb-1">
                                {player?.number} {isLibero && <span className="text-[6px] bg-yellow-500 text-black px-1 rounded ml-1">L</span>}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-white truncate w-full text-center px-2">
                                {player?.name?.split(' ')[1] || player?.name || '---'}
                            </span>
                            <span className="absolute top-1 right-1 text-[6px] font-black text-zinc-800">
                                Z{i < 3 ? [4, 3, 2][i] : [5, 6, 1][i - 3]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
