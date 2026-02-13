'use client';

import { useState, useEffect, memo } from 'react';
import { useMatchListener } from '@/lib/use-match-listener';
import { CricketStateDTO, BasketballStateDTO, FootballStateDTO, BasketballEventDTO, VolleyballStateDTO } from '@fgsn/dtos';

const FGSNProfessionalAlert = memo(({ title, description, visible }: { title: string, description: string, visible: boolean }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] pointer-events-none animate-scale-up-fade">
            <div className="flex flex-col items-center gap-6">
                {/* Logo with Glow */}
                <div className="animate-pulse-glow">
                    <img src="/FGSN-logo.png" alt="FGSN" className="h-24 w-auto logo-glow" />
                </div>

                {/* Text Content - No Background */}
                <div className="flex flex-col items-center text-center">
                    <span className="text-xl font-black uppercase tracking-[0.6em] text-white/60 mb-2 premium-shadow text-outline">
                        {title}
                    </span>
                    <span className="text-8xl font-black text-white italic uppercase tracking-tighter premium-shadow text-outline">
                        {description}
                    </span>
                </div>
            </div>

            {/* Subtle animated side lines/accents could be added here if needed, but keeping it clean for now */}
        </div>
    );
});

const MilestoneAlert = memo(({ milestones }: { milestones: any[] }) => {
    const [latest, setLatest] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (milestones?.length > 0) {
            setLatest(milestones[milestones.length - 1]);
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [milestones]);

    return <FGSNProfessionalAlert title="Milestone Reached" description={latest?.description || ''} visible={visible} />;
});

const EventAlert = memo(({ events }: { events: BasketballEventDTO[] }) => {
    const [latest, setLatest] = useState<BasketballEventDTO | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (events?.length > 0) {
            const last = events[events.length - 1];
            if (['basket', 'foul', 'substitution', 'timeout'].includes(last.type)) {
                setLatest(last);
                setVisible(true);
                const timer = setTimeout(() => setVisible(false), 4000);
                return () => clearTimeout(timer);
            }
        }
    }, [events]);

    return <FGSNProfessionalAlert title={latest?.type || ''} description={latest?.description || ''} visible={visible} />;
});

const BasketballOverlay = memo(({ match, data }: { match: any, data: BasketballStateDTO }) => {
    return (
        <div className="h-screen w-screen flex flex-col justify-end p-16 bg-transparent text-white font-sans max-w-[1920px] mx-auto overflow-hidden animate-fade-in">
            <EventAlert events={data.events} />

            {/* 1. TOP STATS (Efficiency / Period Scores) */}
            <div className="flex gap-4 mb-4 animate-slide-up">
                <div className="bg-black/80 backdrop-blur-md px-6 py-2 border-l-4 border-indigo-500 skew-x-[-12deg]">
                    <span className="skew-x-[12deg] block text-[10px] font-black text-indigo-400 uppercase tracking-widest">Team Stats</span>
                    <span className="skew-x-[12deg] block text-lg font-black tracking-tighter">
                        FG {data.teams.home.stats.fieldGoals.made}/{data.teams.home.stats.fieldGoals.att} ({data.teams.home.stats.fieldGoals.att > 0 ? Math.round((data.teams.home.stats.fieldGoals.made / data.teams.home.stats.fieldGoals.att) * 100) : 0}%)
                    </span>
                </div>
                <div className="bg-black/80 backdrop-blur-md px-6 py-2 border-l-4 border-orange-500 skew-x-[-12deg]">
                    <span className="skew-x-[12deg] block text-[10px] font-black text-orange-400 uppercase tracking-widest">Away Leader</span>
                    <span className="skew-x-[12deg] block text-lg font-black tracking-tighter text-orange-100">
                        CURRY: {data.teams.away.players[0].points} PTS
                    </span>
                </div>
            </div>

            {/* 2. MAIN BOTTOM BAR SCOREBOARD */}
            <div className="flex items-end animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {/* Competition ID */}
                <div className="h-28 w-28 bg-orange-600 flex flex-col items-center justify-center shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-30 border-t-4 border-orange-400">
                    <img src="/FGSN-logo.png" alt="FGSN" className="h-10 w-auto mb-1" />
                    <span className="font-black text-4xl italic leading-none">PRO</span>
                </div>

                {/* Main Score Segment */}
                <div className="h-20 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 backdrop-blur-xl flex items-center px-10 text-white relative z-20 border-b-4 border-orange-600 shadow-2xl skew-x-[-4deg] -ml-2 min-w-[700px]">
                    <div className="skew-x-[4deg] flex items-center justify-between w-full gap-8">
                        {/* Home Team */}
                        <div className="flex items-center gap-6">
                            <span className="text-3xl font-black text-white uppercase tracking-tighter">HOME</span>
                            <div className="relative">
                                <span className={`text-6xl font-black text-white tracking-tighter transition-all ${data.possession.teamId === 'home' ? 'scale-110' : ''}`}>{data.teams.home.score}</span>
                                {data.possession.teamId === 'home' && (
                                    <div className="absolute -top-1 -right-4 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-pulse"></div>
                                )}
                            </div>
                            {data.matchStatus.isInBonus.home && (
                                <div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black italic shadow-[0_0_10px_rgba(220,38,38,0.5)]">BONUS</div>
                            )}
                        </div>

                        {/* Clock & Period */}
                        <div className="flex flex-col items-center justify-center px-8 border-x border-white/10 min-w-[160px]">
                            <span className={`text-4xl font-mono font-black tracking-tighter leading-none ${data.clock.isClockRunning ? 'text-yellow-500' : 'text-zinc-600 animate-pulse'}`}>
                                {data.clock.gameTime}
                            </span>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">{data.clock.period}</span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <span className={`text-6xl font-black text-white tracking-tighter transition-all ${data.possession.teamId === 'away' ? 'scale-110' : ''}`}>{data.teams.away.score}</span>
                                {data.possession.teamId === 'away' && (
                                    <div className="absolute -top-1 -left-4 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-pulse"></div>
                                )}
                            </div>
                            <span className="text-3xl font-black text-zinc-400 uppercase tracking-tighter">AWAY</span>
                            {data.matchStatus.isInBonus.away && (
                                <div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black italic shadow-[0_0_10px_rgba(220,38,38,0.5)]">BONUS</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shot Clock (Right Side) */}
                <div className="h-16 bg-black/90 px-8 flex flex-col items-center justify-center mb-1 ml-4 border-b-4 border-red-600 shadow-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">SC</span>
                    <span className={`text-4xl font-mono font-black leading-none ${data.clock.shotClock <= 5 ? 'text-red-500 animate-blink' : 'text-red-600 opacity-80'}`}>
                        {data.clock.shotClock}
                    </span>
                </div>
            </div>
        </div>
    );
});

const FootballOverlay = memo(({ match, data }: { match: any, data: FootballStateDTO }) => {
    return (
        <div className="h-screen w-screen flex flex-col justify-start p-16 bg-transparent text-white font-sans max-w-[1920px] mx-auto overflow-hidden animate-fade-in will-change-[opacity,transform]">
            {/* 1. FOOTBALL SCOREBUG (Top Left) */}
            <div className="flex items-center animate-slide-up will-change-transform shadow-2xl">
                {/* Logo Section */}
                <div className="h-12 w-16 bg-indigo-700 font-black italic flex items-center justify-center border-b-2 border-indigo-400 px-2">
                    <img src="/FGSN-logo.png" alt="FGSN" className="h-6 w-auto" />
                </div>

                {/* Home Team */}
                <div className="h-12 bg-zinc-900 px-6 flex items-center border-b-2 border-white/10">
                    <span className="font-black text-xl uppercase mr-4 tracking-tighter">HOME</span>
                    <span className="font-black text-3xl text-white">{data.score.home}</span>
                </div>

                {/* Separator / Time */}
                <div className={`h-12 px-6 flex items-center border-b-2 ${data.clock.isRunning ? 'bg-yellow-500 border-yellow-300' : 'bg-zinc-800 border-zinc-700'}`}>
                    <span className={`font-mono font-black text-2xl ${data.clock.isRunning ? 'text-black' : 'text-zinc-500'}`}>
                        {data.clock.gameTime}
                    </span>
                    {data.clock.extraTime > 0 && (
                        <span className="font-bold text-sm ml-1 text-red-600">+{data.clock.extraTime}</span>
                    )}
                </div>

                {/* Away Team */}
                <div className="h-12 bg-zinc-900 px-6 flex items-center border-b-2 border-white/10">
                    <span className="font-black text-3xl text-white">{data.score.away}</span>
                    <span className="font-black text-xl uppercase ml-4 tracking-tighter text-zinc-400">AWAY</span>
                </div>

                {/* Period */}
                <div className="h-12 bg-black/80 px-4 flex items-center border-b-2 border-indigo-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{data.clock.period}</span>
                </div>
            </div>

            {/* 2. EVENT ALERTS (Center Screen) */}
            <div className="flex-1 flex items-center justify-center">
                {/* Goal Alert (Mock Animation Logic) */}
                {match.scoreSummary.home !== "0" && (
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 animate-pulse">
                        {/* This would be triggered by a specific event flag in a real app */}
                    </div>
                )}
            </div>

            {/* 3. LOWER STATS TICKET (Optional) */}
            <div className="mt-auto animate-slide-up will-change-transform" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex bg-black/60 backdrop-blur-md px-8 py-3 rounded-tr-3xl border-l-8 border-indigo-600">
                    <div className="flex gap-12 items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Possession</span>
                            <span className="text-xl font-black text-white">{data.stats.home.possession}% - {data.stats.away.possession}%</span>
                        </div>
                        <div className="flex flex-col border-l border-white/10 pl-12">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Shots on Target</span>
                            <span className="text-xl font-black text-white">{data.stats.home.shotsOnTarget} - {data.stats.away.shotsOnTarget}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

const CricketOverlay = memo(({ match, data }: { match: any, data: CricketStateDTO }) => {
    const [lastBallSpeed, setLastBallSpeed] = useState<number | null>(null);
    const [runs, wickets] = match.scoreSummary.home.split('/');

    useEffect(() => {
        const lastBall = data.ballHistory?.[data.ballHistory.length - 1];
        if (lastBall?.speedKmph) {
            setLastBallSpeed(lastBall.speedKmph);
            const timer = setTimeout(() => setLastBallSpeed(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [data.ballHistory]);

    return (
        <div className="h-screen w-screen flex flex-col justify-end p-16 bg-transparent text-white font-sans max-w-[1920px] mx-auto overflow-hidden animate-fade-in will-change-[opacity,transform]">
            <MilestoneAlert milestones={data.milestones} />

            {lastBallSpeed && (
                <div className="fixed bottom-40 right-16 animate-slide-up flex flex-col items-end will-change-transform">
                    <div className="bg-black/80 backdrop-blur-md px-6 py-2 border-r-4 border-yellow-500 skew-x-[-12deg]">
                        <span className="skew-x-[12deg] block text-[10px] font-black text-zinc-500 uppercase">Ball Speed</span>
                        <span className="skew-x-[12deg] block text-4xl font-black italic text-yellow-500">{lastBallSpeed} <span className="text-xs">KMPH</span></span>
                    </div>
                </div>
            )}

            {/* 1. TOP STATS BAR (Batsmen + Projections) */}
            <div className="flex justify-between items-end mb-4">
                <div className="flex gap-4 animate-slide-up will-change-transform" style={{ animationDelay: '0.1s' }}>
                    {/* Striker */}
                    <div className="flex items-center">
                        <div className="bg-indigo-600 px-4 py-2 font-black text-sm italic skew-x-[-12deg] z-10 border-l-4 border-white">
                            <span className="skew-x-[12deg] block uppercase">{data.striker.name}*</span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-md px-6 py-2 -ml-2 skew-x-[-12deg] border-r border-white/20">
                            <span className="skew-x-[12deg] block text-xl font-black">
                                {data.striker.runs} <span className="text-sm font-bold text-zinc-400">({data.striker.balls})</span>
                            </span>
                        </div>
                    </div>

                    {/* Non-Striker */}
                    <div className="flex items-center opacity-80">
                        <div className="bg-zinc-800 px-4 py-2 font-bold text-sm skew-x-[-12deg] z-10 border-l-4 border-zinc-400">
                            <span className="skew-x-[12deg] block uppercase">{data.nonStriker.name}</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-md px-6 py-2 -ml-2 skew-x-[-12deg] border-r border-white/10">
                            <span className="skew-x-[12deg] block text-xl font-bold">
                                {data.nonStriker.runs} <span className="text-sm font-normal text-zinc-500">({data.nonStriker.balls})</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Projection Widget */}
                <div className="animate-slide-up bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5 will-change-transform" style={{ animationDelay: '0.15s' }}>
                    <div className="flex gap-4 items-center">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Projected (6.0 RR)</span>
                        <span className="text-lg font-black text-indigo-400">{data.projections?.at6RPO || 0}</span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN LOWER THIRD */}
            <div className="flex items-end animate-slide-up will-change-transform">
                {/* Tournament ID */}
                <div className="h-28 w-28 bg-indigo-700 flex flex-col items-center justify-center shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-30 border-t-4 border-indigo-400">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-200">MATCH #1</span>
                    <img src="/FGSN-logo.png" alt="FGSN" className="h-10 w-auto mt-1" />
                </div>

                {/* Score Segment */}
                <div className="h-20 bg-gradient-to-r from-zinc-900 to-black/90 backdrop-blur-xl min-w-[500px] flex items-center px-10 text-white relative z-20 border-b-4 border-indigo-600 shadow-2xl skew-x-[-4deg] -ml-2">
                    <div className="skew-x-[4deg] flex items-center w-full">
                        {/* Team & Score */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-2xl font-black text-indigo-400 uppercase tracking-tighter">IND</span>
                            <div className="flex items-baseline">
                                <span className="text-6xl font-black">{runs}</span>
                                <span className="text-3xl font-bold text-zinc-600 ml-2">/ {wickets}</span>
                            </div>
                        </div>

                        {/* Overs & RR */}
                        <div className="ml-10 pl-10 border-l border-zinc-800 flex flex-col justify-center">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-yellow-500 font-mono tracking-tighter">{data.overs}</span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Overs</span>
                            </div>
                            <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">
                                CRR: {data.runRate}
                            </div>
                        </div>

                        {/* Bowler Stats (Inline) */}
                        <div className="ml-auto flex flex-col items-end">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{data.bowler.name}</span>
                            <div className="text-xl font-black tracking-tighter">
                                {data.bowler.wickets} <span className="text-sm font-bold text-zinc-600">FOR</span> {data.bowler.runs}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ball Tracker (Right Side) */}
                <div className="h-16 bg-white/10 backdrop-blur-md px-6 flex items-center gap-2 mb-1 ml-4 rounded-full border border-white/10 animate-slide-up will-change-transform" style={{ animationDelay: '0.2s' }}>
                    <span className="text-[10px] font-black text-zinc-500 mr-2 uppercase tracking-widest">This Over</span>
                    {data.thisOver.map((ball, i) => (
                        <div key={i} className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-black shadow-lg transform transition-transform ${ball === 'W' ? 'bg-red-600 text-white' : ball === '4' || ball === '6' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                            {ball}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

const VolleyballEventAlert = memo(({ events, teams }: { events: any[], teams: any }) => {
    const [latest, setLatest] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (events?.length > 0) {
            const last = events[events.length - 1];
            const majorEvents = ['ace', 'kill', 'block', 'sub', 'timeout'];
            if (majorEvents.includes(last.type)) {
                setLatest(last);
                setVisible(true);
                const timer = setTimeout(() => setVisible(false), 3500);
                return () => clearTimeout(timer);
            }
        }
    }, [events]);

    const title = latest ? (latest.type === 'sub' ? 'Substitution' : latest.type) : '';
    const description = latest ? `${latest.teamId === 'home' ? 'HOME' : 'AWAY'} ${latest.description}` : '';

    return <FGSNProfessionalAlert title={title} description={description} visible={visible} />;
});

const VolleyballOverlay = memo(({ match, data }: { match: any, data: VolleyballStateDTO }) => {
    const homeSets = data.sets.filter(s => s.home > s.away).length;
    const awaySets = data.sets.filter(s => s.away > s.home).length;

    const isDecidingSet = data.currentSet === data.config.totalSets;
    const pointsToWin = isDecidingSet ? data.config.pointsDecidingSet : data.config.pointsPerSet;
    const isSetPoint = (data.score.home >= pointsToWin - 1 || data.score.away >= pointsToWin - 1) && Math.abs(data.score.home - data.score.away) >= 1;
    const isMatchPoint = isSetPoint && ((data.score.home >= pointsToWin - 1 && homeSets === Math.floor(data.config.totalSets / 2)) || (data.score.away >= pointsToWin - 1 && awaySets === Math.floor(data.config.totalSets / 2)));

    return (
        <div className="h-screen w-screen flex flex-col justify-between p-12 bg-transparent text-white font-sans max-w-[1920px] mx-auto overflow-hidden animate-fade-in selection:bg-yellow-500/30">
            <VolleyballEventAlert events={data.events} teams={data.teams} />

            {/* 1. GLASS SCOREBUG */}
            <div className="flex items-start animate-slide-down">
                <div className="flex flex-col relative group">
                    {/* Ambient Glow Background */}
                    <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />

                    {/* Branding Header */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-4 py-1.5 flex items-center justify-between rounded-t-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/60 relative z-10">FGSN BROADCAST | LIVE VOLLEYBALL</span>
                        <div className="flex gap-1.5 relative z-10">
                            {[...Array(homeSets)].map((_, i) => <div key={`h-${i}`} className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />)}
                            <div className="w-[1px] h-3 bg-white/20 mx-1" />
                            {[...Array(awaySets)].map((_, i) => <div key={`a-${i}`} className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />)}
                        </div>
                    </div>

                    <div className="flex backdrop-blur-3xl bg-black/30 border-x border-b border-white/10 rounded-b-xl overflow-hidden shadow-2xl">
                        {/* Logo Section */}
                        <div className="bg-white/5 w-16 h-20 flex items-center justify-center border-r border-white/10 hover:bg-white/10 transition-colors">
                            <img src="/FGSN-logo.png" alt="FGSN" className="h-8 w-auto opacity-80" />
                        </div>

                        {/* Scores & Teams */}
                        <div className="flex divide-x divide-white/10">
                            {/* Home Team */}
                            <div className={`px-8 py-3 min-w-[160px] flex flex-col justify-center relative transition-all ${data.servingTeam === 'home' ? 'bg-yellow-500/5' : ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-black tracking-widest ${data.servingTeam === 'home' ? 'text-yellow-400' : 'text-white/40'}`}>HOME</span>
                                    {data.servingTeam === 'home' && <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" />}
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className={`text-5xl font-black tabular-nums tracking-tighter transition-all ${data.servingTeam === 'home' ? 'text-white' : 'text-white/70'}`}>
                                        {data.score.home}
                                    </span>
                                    <span className="text-xs font-light text-white/30">PTS</span>
                                </div>
                                {data.servingTeam === 'home' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />}
                            </div>

                            {/* Set / Info Middle Section */}
                            <div className="px-6 flex flex-col items-center justify-center bg-white/5 min-w-[100px] relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">SET</span>
                                <span className="text-3xl font-light tracking-[0.2em] text-yellow-400 leading-none">{data.currentSet}</span>
                                <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </div>

                            {/* Away Team */}
                            <div className={`px-8 py-3 min-w-[160px] flex flex-col justify-center relative transition-all ${data.servingTeam === 'away' ? 'bg-yellow-500/5' : ''}`}>
                                <div className="flex items-center justify-end gap-2 mb-1 text-right">
                                    {data.servingTeam === 'away' && <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" />}
                                    <span className={`text-[10px] font-black tracking-widest ${data.servingTeam === 'away' ? 'text-yellow-400' : 'text-white/40'}`}>AWAY</span>
                                </div>
                                <div className="flex items-baseline justify-end gap-4 text-right">
                                    <span className="text-xs font-light text-white/30">PTS</span>
                                    <span className={`text-5xl font-black tabular-nums tracking-tighter transition-all ${data.servingTeam === 'away' ? 'text-white' : 'text-white/70'}`}>
                                        {data.score.away}
                                    </span>
                                </div>
                                {data.servingTeam === 'away' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />}
                            </div>
                        </div>
                    </div>

                    {/* Point Status Bar */}
                    <div className="overflow-hidden mt-1">
                        {(isSetPoint || isMatchPoint) && (
                            <div className={`animate-slide-down backdrop-blur-md px-6 py-1 mx-auto w-max rounded-b-lg border-x border-b border-white/20 flex items-center gap-3 ${isMatchPoint ? 'bg-red-500/20 text-red-100' : 'bg-orange-500/20 text-orange-100'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMatchPoint ? 'bg-red-400' : 'bg-orange-400'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] italic">
                                    {isMatchPoint ? 'Match Point' : 'Set Point'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. BOTTOM GLASS TICKET */}
            <div className="flex items-end justify-between animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex gap-4">
                    {/* Modern Set History */}
                    <div className="backdrop-blur-2xl bg-black/20 border border-white/10 px-8 py-4 rounded-2xl flex flex-col shadow-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-3 bg-yellow-400 rounded-full" />
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Match Timeline</span>
                        </div>
                        <div className="flex gap-3">
                            {data.sets.length > 0 ? data.sets.map((s, i) => (
                                <div key={i} className="flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors">
                                    <span className="text-[8px] font-bold text-white/30 uppercase mb-1">SET {i + 1}</span>
                                    <span className="text-base font-medium tabular-nums text-white">
                                        <span className={s.home > s.away ? 'text-yellow-400' : ''}>{s.home}</span>
                                        <span className="mx-1 text-white/20">/</span>
                                        <span className={s.away > s.home ? 'text-yellow-400' : ''}>{s.away}</span>
                                    </span>
                                </div>
                            )) : (
                                <div className="flex items-center gap-2 text-white/30 italic text-xs px-2">
                                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                                    No sets recorded
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Activity Glass Widget */}
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 px-10 py-5 rounded-3xl flex flex-col items-end shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-bold text-yellow-500/60 uppercase tracking-[0.4em] mb-2 relative z-10">Live Feed</span>
                    <div className="text-2xl font-light italic uppercase tracking-tight text-white/90 relative z-10">
                        {data.events.length > 0 ? (
                            <span className="animate-fade-in">{data.events[data.events.length - 1].description}</span>
                        ) : (
                            <span className="text-white/20">Waiting for first serve...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default function OverlayPage() {
    const match = useMatchListener();
    const [testAlert, setTestAlert] = useState(false);

    if (!match) return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-transparent">
            <button
                onClick={() => {
                    setTestAlert(true);
                    setTimeout(() => setTestAlert(false), 4000);
                }}
                className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-xs font-black uppercase tracking-widest transition-colors mb-4"
            >
                Test Alert Layout
            </button>
            <FGSNProfessionalAlert
                title="Broadcast Test"
                description="Professional Alert System Active"
                visible={testAlert}
            />
            <div className="text-white bg-black/80 p-4 rounded font-mono">WAITING FOR SIGNAL...</div>
        </div>
    );

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <button
                onClick={() => {
                    setTestAlert(true);
                    setTimeout(() => setTestAlert(false), 4000);
                }}
                className="absolute top-4 right-4 z-[101] pointer-events-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-colors"
            >
                Test Alert
            </button>

            <FGSNProfessionalAlert
                title="Live Alert"
                description="Professional Overlay Test"
                visible={testAlert}
            />

            {match.sport === 'cricket' ? (
                <CricketOverlay match={match} data={match.liveData as CricketStateDTO} />
            ) : match.sport === 'basketball' ? (
                <BasketballOverlay match={match} data={match.liveData as BasketballStateDTO} />
            ) : match.sport === 'volleyball' ? (
                <VolleyballOverlay match={match} data={match.liveData as VolleyballStateDTO} />
            ) : (
                <FootballOverlay match={match} data={match.liveData as FootballStateDTO} />
            )}
        </div>
    );
}
