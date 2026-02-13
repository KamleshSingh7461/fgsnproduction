'use client';

import { useState } from 'react';
import { MatchProvider, useMatch } from '@/lib/match-context';
import { Card, Button } from '@fgsn/ui';
import { Activity } from 'lucide-react';
import { CricketBallDTO, BasketballStateDTO, CricketStateDTO, FootballStateDTO } from '@fgsn/dtos';
import VolleyballScorer from '../components/VolleyballScorer';

const BasketballScorerInterface = () => {
    const { match, assignedRole, submitBasket, handleFoul, toggleClock, submitBasketballStat, submitTimeout, submitSubstitution, resetShotClock, setClockTime } = useMatch();
    const bball = match.liveData as BasketballStateDTO;
    if (!bball || !bball.teams) return null;

    const [selectedHomePlayerId, setSelectedHomePlayerId] = useState<string | null>(null);
    const [selectedAwayPlayerId, setSelectedAwayPlayerId] = useState<string | null>(null);

    // Role Checks
    const canEditHome = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'HOME_SCORER' || assignedRole === 'SCORER' || assignedRole === 'SUPER_ADMIN';
    const canEditAway = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'AWAY_SCORER' || assignedRole === 'SCORER' || assignedRole === 'SUPER_ADMIN';
    const canEditStats = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'STATS_SCORER' || assignedRole === 'SCORER' || assignedRole === 'SUPER_ADMIN';
    const isGlobalAdmin = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'SUPER_ADMIN' || assignedRole === 'EVENT_MANAGER';

    const currentHomePlayer = bball.teams.home?.players?.find(p => p.id === selectedHomePlayerId);
    const currentAwayPlayer = bball.teams.away?.players?.find(p => p.id === selectedAwayPlayerId);

    const handleStat = (team: 'home' | 'away', type: 'rebound' | 'assist' | 'steal' | 'block' | 'turnover', subType?: 'off' | 'def') => {
        const playerId = team === 'home' ? selectedHomePlayerId : selectedAwayPlayerId;
        if (!playerId || !canEditStats) return;
        submitBasketballStat(team, playerId, type, subType);
    };

    const handleShot = (team: 'home' | 'away', points: 1 | 2 | 3, isMake: boolean) => {
        if ((team === 'home' && !canEditHome) || (team === 'away' && !canEditAway)) return;
        const playerId = team === 'home' ? selectedHomePlayerId : selectedAwayPlayerId;
        submitBasket(points, team, isMake, playerId || undefined);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1600px] animate-fade-in">
            {/* Top: Scoreboard & Clock */}
            <Card variant="glass" className="p-4 text-center relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-left w-1/3">
                        <div className="text-6xl font-black text-white leading-none">{bball.teams.home.score}</div>
                        <div className="flex gap-1 mt-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i < bball.matchStatus.timeoutsRemaining.home ? 'bg-indigo-500' : 'bg-zinc-800'}`}></div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center w-1/3">
                        <div className={`text-4xl font-mono font-black ${bball.clock.isClockRunning ? 'text-yellow-500' : 'text-zinc-600'}`}>
                            {bball.clock.gameTime}
                        </div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase mt-1">{bball.clock.period}</div>
                        <div className="mt-3 px-3 py-1 bg-red-600/20 border border-red-600/40 rounded-full inline-block">
                            <span className={`text-lg font-black font-mono ${bball.clock.shotClock !== null && bball.clock.shotClock <= 5 ? 'text-red-500 animate-pulse' : 'text-red-600'}`}>
                                {bball.clock.shotClock}
                            </span>
                        </div>
                    </div>
                    <div className="text-right w-1/3">
                        <div className="text-6xl font-black text-white leading-none">{bball.teams.away.score}</div>
                        <div className="flex gap-1 mt-2 flex-row-reverse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${i < bball.matchStatus.timeoutsRemaining.away ? 'bg-orange-500' : 'bg-zinc-800'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={toggleClock} variant={bball.clock.isClockRunning ? 'danger' : 'primary'} className="h-8 px-6 font-black uppercase text-[10px]">
                        {bball.clock.isClockRunning ? 'STOP' : 'START'}
                    </Button>
                    <div className="flex gap-2">
                        <Button onClick={() => resetShotClock(24)} variant="secondary" className="h-8 px-3 font-black uppercase text-[10px]">SC 24</Button>
                        <Button onClick={() => resetShotClock(14)} variant="secondary" className="h-8 px-3 font-black uppercase text-[10px]">SC 14</Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HOME CONTROLLER */}
                <Card variant="solid" className={`p-4 bg-zinc-900 border-zinc-800 ${!canEditHome ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">HOME TEAM CONTROLS</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Home Roster */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {bball.teams.home.players.map(player => (
                                <button
                                    key={player.id}
                                    onClick={() => setSelectedHomePlayerId(player.id)}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${selectedHomePlayerId === player.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-zinc-700'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black bg-white/10 w-6 h-6 flex items-center justify-center rounded">{player.number}</span>
                                        <span className="text-xs font-bold uppercase truncate">{player.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black">{player.points} PTS</span>
                                </button>
                            ))}
                        </div>

                        {/* Home Actions */}
                        <div className="space-y-4">
                            <div className="text-center font-bold text-xs text-zinc-500 uppercase">{currentHomePlayer ? currentHomePlayer.name : 'Select Player'}</div>

                            {/* Scoring */}
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleShot('home', 1, true)} className="aspect-square bg-green-600/20 border border-green-600/50 hover:bg-green-600 rounded-xl flex flex-col items-center justify-center transition-all group">
                                    <span className="text-xl font-black text-green-500 group-hover:text-white">1</span>
                                    <span className="text-[7px] font-black text-green-500/50 group-hover:text-white/80 uppercase">FT</span>
                                </button>
                                <button onClick={() => handleShot('home', 2, true)} className="aspect-square bg-indigo-600/20 border border-indigo-600/50 hover:bg-indigo-600 rounded-xl flex flex-col items-center justify-center transition-all group">
                                    <span className="text-xl font-black text-indigo-500 group-hover:text-white">2</span>
                                    <span className="text-[7px] font-black text-indigo-500/50 group-hover:text-white/80 uppercase">FG</span>
                                </button>
                                <button onClick={() => handleShot('home', 3, true)} className="aspect-square bg-indigo-600/20 border border-indigo-600/50 hover:bg-indigo-600 rounded-xl flex flex-col items-center justify-center transition-all group">
                                    <span className="text-xl font-black text-indigo-500 group-hover:text-white">3</span>
                                    <span className="text-[7px] font-black text-indigo-500/50 group-hover:text-white/80 uppercase">3PT</span>
                                </button>
                            </div>

                            {/* Misses */}
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleShot('home', 1, false)} className="p-1.5 bg-zinc-800 rounded-lg text-[8px] font-black uppercase text-zinc-500 hover:text-white">Miss 1</button>
                                <button onClick={() => handleShot('home', 2, false)} className="p-1.5 bg-zinc-800 rounded-lg text-[8px] font-black uppercase text-zinc-500 hover:text-white">Miss 2</button>
                                <button onClick={() => handleShot('home', 3, false)} className="p-1.5 bg-zinc-800 rounded-lg text-[8px] font-black uppercase text-zinc-500 hover:text-white">Miss 3</button>
                            </div>

                            {/* Stats */}
                            <div className={`space-y-2 ${!canEditStats ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleStat('home', 'rebound', 'def')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Def Reb</button>
                                    <button onClick={() => handleStat('home', 'rebound', 'off')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Off Reb</button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => handleStat('home', 'assist')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Ast</button>
                                    <button onClick={() => handleStat('home', 'steal')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Stl</button>
                                    <button onClick={() => handleStat('home', 'block')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Blk</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleStat('home', 'turnover')} className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg text-[9px] font-black uppercase text-red-500">Turnover</button>
                                    <button onClick={() => handleFoul('home', selectedHomePlayerId || undefined)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-[9px] font-black uppercase text-white">Foul</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <Button onClick={() => submitTimeout('home')} variant="secondary" className="w-full text-[9px] font-black uppercase mb-2">Timeout</Button>
                                <Button variant="secondary" className="w-full text-[9px] font-black uppercase">Sub Out</Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* AWAY CONTROLLER */}
                <Card variant="solid" className={`p-4 bg-zinc-900 border-zinc-800 ${!canEditAway ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">AWAY TEAM CONTROLS</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Away Roster */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {bball.teams.away.players.map(player => (
                                <button
                                    key={player.id}
                                    onClick={() => setSelectedAwayPlayerId(player.id)}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${selectedAwayPlayerId === player.id ? 'bg-orange-600 border-orange-400 text-white' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-zinc-700'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black bg-white/10 w-6 h-6 flex items-center justify-center rounded">{player.number}</span>
                                        <span className="text-xs font-bold uppercase truncate">{player.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black">{player.points} PTS</span>
                                </button>
                            ))}
                        </div>

                        {/* Away Actions */}
                        <div className="space-y-4">
                            <div className="text-center font-bold text-xs text-zinc-500 uppercase">{currentAwayPlayer ? currentAwayPlayer.name : 'Select Player'}</div>

                            {/* Scoring */}
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleShot('away', 1, true)} className="aspect-square bg-green-600/20 border border-green-600/50 hover:bg-green-600 rounded-xl flex flex-col items-center justify-center transition-all group">
                                    <span className="text-xl font-black text-green-500 group-hover:text-white">1</span>
                                    <span className="text-[7px] font-black text-green-500/50 group-hover:text-white/80 uppercase">FT</span>
                                </button>
                                <button onClick={() => handleShot('away', 2, true)} className="aspect-square bg-orange-600/20 border border-orange-600/50 hover:bg-orange-600 rounded-xl flex flex-col items-center justify-center transition-all group">
                                    <span className="text-xl font-black text-orange-500 group-hover:text-white">2</span>
                                    <span className="text-[7px] font-black text-orange-500/50 group-hover:text-white/80 uppercase">FG</span>
                                </button>
                                <button onClick={() => handleShot('away', 3, true)} className="aspect-square bg-orange-600/20 border border-orange-600/50 hover:bg-orange-600 rounded-xl flex flex-col items-center justify-center transition-all group">
                                    <span className="text-xl font-black text-orange-500 group-hover:text-white">3</span>
                                    <span className="text-[7px] font-black text-orange-500/50 group-hover:text-white/80 uppercase">3PT</span>
                                </button>
                            </div>

                            {/* Misses */}
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleShot('away', 1, false)} className="p-1.5 bg-zinc-800 rounded-lg text-[8px] font-black uppercase text-zinc-500 hover:text-white">Miss 1</button>
                                <button onClick={() => handleShot('away', 2, false)} className="p-1.5 bg-zinc-800 rounded-lg text-[8px] font-black uppercase text-zinc-500 hover:text-white">Miss 2</button>
                                <button onClick={() => handleShot('away', 3, false)} className="p-1.5 bg-zinc-800 rounded-lg text-[8px] font-black uppercase text-zinc-500 hover:text-white">Miss 3</button>
                            </div>

                            {/* Stats */}
                            <div className={`space-y-2 ${!canEditStats ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleStat('away', 'rebound', 'def')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Def Reb</button>
                                    <button onClick={() => handleStat('away', 'rebound', 'off')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Off Reb</button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => handleStat('away', 'assist')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Ast</button>
                                    <button onClick={() => handleStat('away', 'steal')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Stl</button>
                                    <button onClick={() => handleStat('away', 'block')} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black uppercase text-white">Blk</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleStat('away', 'turnover')} className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg text-[9px] font-black uppercase text-red-500">Turnover</button>
                                    <button onClick={() => handleFoul('away', selectedAwayPlayerId || undefined)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-[9px] font-black uppercase text-white">Foul</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <Button onClick={() => submitTimeout('away')} variant="secondary" className="w-full text-[9px] font-black uppercase mb-2">Timeout</Button>
                                <Button variant="secondary" className="w-full text-[9px] font-black uppercase">Sub Out</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Events Log (Shared/Bottom) */}
            <Card variant="solid" className="p-4 bg-zinc-900 border-zinc-800">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Recent Events</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {bball.events.slice().reverse().map(event => (
                        <div key={event.id} className="min-w-[200px] text-[10px] border border-white/5 rounded-lg p-2 bg-black/20">
                            <div className="flex justify-between font-black uppercase">
                                <span className={event.teamId === 'home' ? 'text-indigo-400' : 'text-orange-400'}>{event.type}</span>
                                <span className="text-zinc-600">{event.minute}</span>
                            </div>
                            <div className="text-zinc-400 font-bold mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{event.description}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const StatBar = ({ label, val, total }: { label: string, val: number, total: number }) => {
    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
    return (
        <div>
            <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase mb-1">
                <span>{label}</span>
                <span>{val}/{total} ({pct}%)</span>
            </div>
            <div className="h-1 bg-black rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }}></div>
            </div>
        </div>
    );
}

const FootballScorerInterface = () => {
    const { match, assignedRole, submitGoal, submitCard, toggleClock } = useMatch();
    const football = match.liveData as FootballStateDTO;
    if (!football || !football.stats) return null;

    // Role Checks
    const canEditHome = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'HOME_SCORER' || assignedRole === 'SCORER' || assignedRole === 'SUPER_ADMIN' || assignedRole === 'EVENT_MANAGER';
    const canEditAway = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'AWAY_SCORER' || assignedRole === 'SCORER' || assignedRole === 'SUPER_ADMIN' || assignedRole === 'EVENT_MANAGER';
    const isGlobalAdmin = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'SUPER_ADMIN' || assignedRole === 'EVENT_MANAGER';

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full max-w-7xl animate-fade-in">
            {/* Left Col: Stats */}
            <div className="xl:col-span-1 space-y-6">
                <Card variant="solid" className="p-4 bg-zinc-900 border-zinc-800">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Match Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400">Possession</span>
                            <div className="flex gap-2 items-center">
                                <span className="text-white font-bold">{football.stats.home.possession}%</span>
                                <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full" style={{ width: `${football.stats.home.possession}%` }}></div>
                                </div>
                                <span className="text-white font-bold">{football.stats.away.possession}%</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-zinc-400">Shots (T)</span>
                            <span className="text-white font-black">{football.stats.home.shots}({football.stats.home.shotsOnTarget}) - {football.stats.away.shots}({football.stats.away.shotsOnTarget})</span>
                        </div>
                    </div>
                </Card>

                <Card variant="solid" className="p-4 bg-zinc-900 border-zinc-800">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Event Log</h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {football.events.goals.map((g, i) => (
                            <div key={`g-${i}`} className="flex items-center gap-2 text-[10px] text-green-400 font-bold">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                GOAL: {g.teamId.toUpperCase()} ({g.minute}')
                            </div>
                        ))}
                        {football.events.cards.map((c, i) => (
                            <div key={`c-${i}`} className={`flex items-center gap-2 text-[10px] font-bold ${c.type === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`}>
                                <div className={`w-2 h-2 rounded-sm ${c.type === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                {c.type.toUpperCase()} CARD: {c.teamId.toUpperCase()} ({c.minute}')
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Center Col: Score & Clock */}
            <div className="xl:col-span-2 space-y-6">
                <Card variant="glass" className="p-10 text-center relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-left w-1/3">
                            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">HOME</div>
                            <div className="text-9xl font-black text-white leading-none">{football.score.home}</div>
                        </div>
                        <div className="text-center w-1/3">
                            <div className={`text-6xl font-mono font-black ${football.clock.isRunning ? 'text-yellow-500' : 'text-zinc-700'}`}>
                                {football.clock.gameTime}
                            </div>
                            <div className="text-xs font-black text-zinc-500 uppercase mt-2">{football.clock.period} + {football.clock.extraTime}</div>
                        </div>
                        <div className="text-right w-1/3">
                            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">AWAY</div>
                            <div className="text-9xl font-black text-white leading-none">{football.score.away}</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 border-t border-white/5 pt-6">
                        {(isGlobalAdmin || canEditHome || canEditAway) && (
                            <Button onClick={toggleClock} variant={football.clock.isRunning ? 'danger' : 'primary'} className="h-12 w-48 font-black uppercase">
                                {football.clock.isRunning ? 'STOP CLOCK' : 'START CLOCK'}
                            </Button>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-8">
                    <div className={`space-y-4 transition-opacity ${!canEditHome ? 'opacity-20 pointer-events-none' : ''}`}>
                        <h4 className="text-[10px] font-black text-center text-zinc-500 uppercase tracking-widest">Home Controls</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <Button onClick={() => submitGoal('home', 'p1')} className="h-16 bg-green-600 text-white font-black text-xl">+ GOAL</Button>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => submitCard('home', 'p1', 'yellow')} className="bg-yellow-500/20 border-yellow-500/40 text-yellow-500 font-bold text-[10px]">YELLOW</Button>
                                <Button onClick={() => submitCard('home', 'p1', 'red')} className="bg-red-500/20 border-red-500/40 text-red-500 font-bold text-[10px]">RED CARD</Button>
                            </div>
                        </div>
                    </div>
                    <div className={`space-y-4 transition-opacity ${!canEditAway ? 'opacity-20 pointer-events-none' : ''}`}>
                        <h4 className="text-[10px] font-black text-center text-zinc-500 uppercase tracking-widest">Away Controls</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <Button onClick={() => submitGoal('away', 'p2')} className="h-16 bg-green-600 text-white font-black text-xl">+ GOAL</Button>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => submitCard('away', 'p2', 'yellow')} className="bg-yellow-500/20 border-yellow-500/40 text-yellow-500 font-bold text-[10px]">YELLOW</Button>
                                <Button onClick={() => submitCard('away', 'p2', 'red')} className="bg-red-500/20 border-red-500/40 text-red-500 font-bold text-[10px]">RED CARD</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Substitutions & Events */}
            <div className="xl:col-span-1 space-y-6">
                <Card variant="solid" className="p-4 bg-zinc-900 border-zinc-800">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Button variant="secondary" className="w-full text-[10px] font-bold">+ FOUL</Button>
                        <Button variant="secondary" className="w-full text-[10px] font-bold">+ CORNER</Button>
                        <Button variant="secondary" className="w-full text-[10px] font-bold">+ SHOT</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CricketScorerInterface = () => {
    const { match, assignedRole, submitBall } = useMatch();
    const cricket = match.liveData as CricketStateDTO;
    const [ballSpeed, setBallSpeed] = useState('');

    if (!cricket || !cricket.teams) return null;

    // For Cricket, we'll assume the primary Scorer has full control for now,
    // as it's harder to split by team. But we'll still check for generic SCORER role.
    const canEdit = !assignedRole || assignedRole === 'ADMIN' || assignedRole === 'SCORER' || assignedRole === 'SUPER_ADMIN' || assignedRole === 'EVENT_MANAGER';

    const handleBall = (runs: number, extraType?: 'wide' | 'no-ball', isWicket: boolean = false) => {
        const ball: CricketBallDTO = {
            ballNumber: cricket.ballHistory?.length || 0,
            bowlerId: cricket.bowler.id,
            strikerId: cricket.striker.id,
            nonStrikerId: cricket.nonStriker.id,
            runsScored: runs,
            extras: extraType ? { type: extraType, runs: (extraType === 'wide' || extraType === 'no-ball') ? 1 : 0 } : undefined,
            wicket: isWicket ? { isWicket: true, type: 'bowled' } : undefined,
            speedKmph: ballSpeed ? parseFloat(ballSpeed) : undefined,
        };
        submitBall(ball);
        setBallSpeed('');
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full max-w-7xl animate-fade-in">
            {/* Left Column: Stats & Feed */}
            <div className="xl:col-span-1 space-y-6">
                <Card variant="solid" className="p-4 bg-zinc-900/80 border-zinc-800">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Projected Scores</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400">Current RR ({cricket.runRate})</span>
                            <span className="text-lg font-black text-white">{cricket.projections?.atCurrentRate || 0}</span>
                        </div>
                        <div className="h-[1px] bg-white/5 w-full"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400 italic">At 8.0 RPO</span>
                            <span className="text-lg font-black text-indigo-400">{cricket.projections?.at8RPO || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400 italic">At 10.0 RPO</span>
                            <span className="text-lg font-black text-indigo-400">{cricket.projections?.at10RPO || 0}</span>
                        </div>
                    </div>
                </Card>

                <Card variant="solid" className="p-4 bg-zinc-900/80 border-zinc-800 max-h-[400px] overflow-y-auto">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Milestones</h3>
                    <div className="space-y-2">
                        {cricket.milestones?.length > 0 ? (
                            cricket.milestones.map((m: any, i: number) => (
                                <div key={i} className="p-2 bg-indigo-600/10 border-l-2 border-indigo-500 rounded text-[11px]">
                                    <span className="font-bold text-indigo-300 mr-1">NEW:</span> {m.description}
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] text-zinc-600 italic">No milestones yet...</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Center Column: Main Scoring */}
            <div className="xl:col-span-2 space-y-6">
                <Card variant="glass" className="p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <div className="text-9xl font-black italic">FGSN</div>
                    </div>

                    <div className="flex justify-between items-end relative z-10">
                        <div>
                            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Current Scoreboard</h2>
                            <div className="text-9xl font-black text-white leading-none tracking-tighter">
                                {match.scoreSummary.home}
                            </div>
                            <div className="text-3xl font-black text-zinc-600 mt-4 flex items-center gap-4">
                                {cricket.overs} <span className="text-sm font-bold uppercase tracking-widest text-zinc-700">OVERS</span>
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Ball Tracker</div>
                            <div className="flex flex-wrap justify-end gap-2 max-w-[200px]">
                                {cricket.thisOver.map((b: string, i: number) => (
                                    <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 transform rotate-3 ${b === 'W' ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' :
                                        b.includes('nb') || b.includes('wd') ? 'bg-yellow-500 border-yellow-300 text-black' :
                                            b === '4' || b === '6' ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' :
                                                'bg-zinc-800 border-zinc-700 text-zinc-400'
                                        }`}>
                                        {b}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-600/10 border-2 border-indigo-600/30 p-6 rounded-2xl relative">
                        <div className="text-[9px] font-black text-indigo-400 uppercase mb-2">Striker</div>
                        <div className="text-2xl font-black uppercase text-white truncate mb-1">{cricket.striker.name}</div>
                        <div className="text-4xl font-black">
                            {cricket.striker.runs}<span className="text-lg text-zinc-600 ml-1">({cricket.striker.balls})</span>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-2xl opacity-60">
                        <div className="text-[9px] font-black text-zinc-500 uppercase mb-2">Non-Striker</div>
                        <div className="text-2xl font-black uppercase text-zinc-400 truncate mb-1">{cricket.nonStriker.name}</div>
                        <div className="text-4xl font-black text-zinc-500">
                            {cricket.nonStriker.runs}<span className="text-lg text-zinc-700 ml-1">({cricket.nonStriker.balls})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Controls */}
            <div className="xl:col-span-1 space-y-6">
                <Card variant="solid" className={`p-6 bg-zinc-900 border-zinc-800 shadow-2xl transition-opacity ${!canEdit ? 'opacity-20 pointer-events-none' : ''}`}>
                    <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] mb-6 uppercase border-b border-zinc-800 pb-2">Direct Input</h3>
                    <div className="mb-6">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase mb-2 block">Ball Speed (KMPH)</label>
                        <input
                            type="number"
                            value={ballSpeed}
                            onChange={(e) => setBallSpeed(e.target.value)}
                            placeholder="Speed (e.g. 145.2)"
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xl font-black text-indigo-400 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {[0, 1, 2, 3].map(run => <Button key={run} onClick={() => handleBall(run)} variant="secondary" className="h-12 font-black">{run}</Button>)}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <Button onClick={() => handleBall(4)} variant="primary" className="h-14 font-black bg-green-700">4</Button>
                        <Button onClick={() => handleBall(6)} variant="primary" className="h-14 font-black bg-green-700">6</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => handleBall(0, 'wide')} className="h-10 bg-yellow-600/10 border border-yellow-600/30 text-yellow-600 rounded-lg text-[10px] font-bold uppercase">WIDE</button>
                        <button onClick={() => handleBall(0, 'no-ball')} className="h-10 bg-yellow-600/10 border border-yellow-600/30 text-yellow-600 rounded-lg text-[10px] font-bold uppercase">NO BALL</button>
                    </div>
                    <Button onClick={() => handleBall(0, undefined, true)} variant="danger" className="w-full h-14 font-black text-lg">WICKET / OUT</Button>
                </Card>
            </div>
        </div>
    );
};

function ScorerMain() {
    const { match, switchSport, undo, redo, canUndo, canRedo, assignedRole, user, isLoading } = useMatch();
    const [advancedMode, setAdvancedMode] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mx-auto mb-8 shadow-[0_0_50px_rgba(234,179,8,0.2)]" />
                    <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] animate-pulse">Establishing Tactical Uplink</h2>
                    <p className="text-yellow-500/50 text-[10px] font-bold uppercase tracking-widest mt-4">Syncing Mission Data with Command Center...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <Card variant="glass" className="max-w-md w-full p-8 text-center border-red-500/50">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <Activity className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Unauthorized</h2>
                    <p className="text-zinc-400 text-sm mb-6">Tactical command requires active duty session. Please return to Gate.</p>
                    <Button onClick={() => window.location.href = 'http://localhost:3000'} className="w-full font-black uppercase tracking-widest text-xs py-4">
                        Return to Hub
                    </Button>
                </Card>
            </div>
        );
    }

    const isReadOnly = assignedRole !== 'SCORER';

    return (
        <div className="min-h-screen p-0 flex flex-col items-center bg-[#050505]">
            {isReadOnly && (
                <div className="w-full bg-amber-500/10 border-b border-amber-500/20 py-2 text-center sticky top-0 z-[60] backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center justify-center gap-2">
                        <Activity className="w-3 h-3 animate-pulse" /> Mission Status: Read-Only Proxy
                    </span>
                </div>
            )}
            {/* Top Bar */}
            <header className="w-full max-w-7xl flex justify-between items-center px-6 py-4 mb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <img
                        src="/FGSN-logo.png"
                        alt="FGSN Logo"
                        className="h-12 w-auto"
                    />
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                            Scoring <span className="text-indigo-500">Engine</span>
                        </h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">
                            Compliance Mode: <span className="text-green-500 italic">Universal Broadcaster v3.0</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex gap-2 mr-4">
                        <button
                            onClick={undo}
                            disabled={!canUndo}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${canUndo ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-900/50 text-zinc-700 cursor-not-allowed'}`}
                        >
                            Undo
                        </button>
                        <button
                            onClick={redo}
                            disabled={!canRedo}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${canRedo ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-900/50 text-zinc-700 cursor-not-allowed'}`}
                        >
                            Redo
                        </button>
                    </div>
                    {assignedRole !== 'SCORER' && (
                        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                            <button
                                onClick={() => { alert('Cricket clicked'); switchSport('cricket'); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${match.sport === 'cricket' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Cricket
                            </button>
                            <button
                                onClick={() => { alert('Basketball clicked'); switchSport('basketball'); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${match.sport === 'basketball' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Basketball
                            </button>
                            <button
                                onClick={() => { alert('Football clicked'); switchSport('football'); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${match.sport === 'football' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Football
                            </button>
                            <button
                                onClick={() => { alert('Volleyball clicked'); switchSport('volleyball'); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${match.sport === 'volleyball' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Volleyball
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setAdvancedMode(!advancedMode)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${advancedMode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                    >
                        {advancedMode ? 'ADVANCED: ON' : 'ADVANCED: OFF'}
                    </button>
                </div>
            </header>

            {match.sport === 'cricket' ? <CricketScorerInterface /> :
                match.sport === 'basketball' ? <BasketballScorerInterface /> :
                    match.sport === 'volleyball' ? <VolleyballScorer /> :
                        <FootballScorerInterface />}
        </div>
    );
}

export default function Page() {
    return (
        <MatchProvider>
            <ScorerMain />
        </MatchProvider>
    );
}
