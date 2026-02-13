'use client';

import { useMatch } from '../lib/match-context';
import { VolleyballStateDTO, VolleyballPlayerStatsDTO } from '@fgsn/dtos';
import { Button } from '@fgsn/ui'; // Assuming buttons exist
import { RotateCw, Settings, Timer, UserPlus, Trophy, Skull, Shield, AlertTriangle, Activity } from 'lucide-react';
import { useState } from 'react';

export default function VolleyballScorer() {
    const {
        match,
        submitPoint,
        submitRotation,
        submitVolleyballStat,
        updateVolleyballConfig,
        updateVolleyballPlayer,
        submitTimeout,
        submitSubstitution
    } = useMatch();

    const [showConfig, setShowConfig] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<{ teamId: 'home' | 'away', playerId: string } | null>(null);
    const [showSubModal, setShowSubModal] = useState<'home' | 'away' | null>(null);

    if (match.sport !== 'volleyball' || !match.liveData) return null;
    const vb = match.liveData as VolleyballStateDTO;

    if (!vb.teams || !vb.rotations || !vb.score) {
        return (
            <div className="p-10 text-center text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
                Initializing Disciplinary Roster...
            </div>
        );
    }

    const { home, away } = vb.teams;
    const sets = vb.sets || [];
    const setsHome = sets.filter(s => s.home > s.away).length;
    const setsAway = sets.filter(s => s.away > s.home).length;

    const handleStat = (type: 'ace' | 'kill' | 'block' | 'error' | 'dig', teamId: 'home' | 'away') => {
        if (selectedPlayer?.teamId === teamId) {
            submitVolleyballStat(type, teamId, selectedPlayer.playerId);
            setSelectedPlayer(null); // Deselect after action
        } else {
            // Apply to team generally if allowed, or alert user
            // For now, let's allow generic team stats if no player selected, or just generic point
            if (type === 'error') {
                // Error by team (no specific player) -> Opponent point
                submitVolleyballStat(type, teamId);
            } else {
                alert("Please select a player first for this stat!");
            }
        }
    };

    const handleSub = (teamId: 'home' | 'away', playerOutId: string, playerInId: string) => {
        submitSubstitution(teamId, playerInId, playerOutId);
        setShowSubModal(null);
        setSelectedPlayer(null);
    };

    const toggleLibero = (teamId: 'home' | 'away', playerId: string, currentPos: string) => {
        const newPos = currentPos === 'L' ? 'OH' : 'L'; // Toggle between Libero and Outside Hitter (standard default)
        updateVolleyballPlayer(teamId, playerId, { position: newPos as any });
    };

    const Court = ({ teamId }: { teamId: 'home' | 'away' }) => {
        const team = vb.teams?.[teamId];
        const roster = vb.rotations?.[teamId] || [];
        if (!team) return null;
        // Volleyball Zones:
        // 4 3 2 (Net)
        // 5 6 1
        // Simplified grid for UI to match visual court
        // Front Row: 4, 3, 2
        // Back Row:  5, 6, 1
        const grid = [
            roster[3], roster[2], roster[1],
            roster[4], roster[5], roster[0]
        ];

        return (
            <div className={`grid grid-cols-3 gap-2 p-4 rounded-lg border-4 transition-colors ${vb.servingTeam === teamId ? 'border-yellow-400 bg-yellow-50/10' : 'border-transparent bg-gray-50'
                }`}>
                {grid.map((pid, i) => {
                    const player = team.players.find(p => p.id === pid);
                    const isSelected = selectedPlayer?.playerId === pid;
                    const isLibero = (player as any)?.position === 'L';

                    return (
                        <div
                            key={i}
                            onClick={() => setSelectedPlayer(isSelected ? null : { teamId, playerId: pid })}
                            className={`aspect-square flex flex-col items-center justify-center rounded shadow cursor-pointer transition-all border-2 relative ${isSelected
                                ? 'bg-blue-600 text-white border-blue-400 scale-105 z-10'
                                : isLibero
                                    ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
                                    : 'bg-white hover:bg-gray-50 border-transparent'
                                }`}
                        >
                            <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{player?.number} {isLibero && <span className="text-[8px] bg-yellow-600 text-white px-1 rounded ml-1">L</span>}</span>
                            <span className="truncate w-full text-center px-1 font-bold text-xs">{player?.name?.split(' ')[1] || player?.name}</span>

                            {isLibero && i < 3 && (
                                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-[6px] font-black text-center py-0.5 animate-pulse uppercase tracking-tighter">
                                    Illegal Front Row
                                </div>
                            )}

                            {/* Stats Mini view */}
                            {player && (
                                <div className="flex gap-1 mt-1 text-[8px]">
                                    {player.points > 0 && <span className={`${isSelected ? 'bg-blue-400/30' : 'bg-green-100 text-green-800'} px-1 rounded`}>{player.points} pts</span>}
                                </div>
                            )}

                            {/* Position Indicator */}
                            <span className={`absolute top-1 right-1 text-[8px] ${isSelected ? 'text-blue-200' : 'opacity-30'}`}>
                                Z{i < 3 ? [4, 3, 2][i] : [5, 6, 1][i - 3]}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col gap-4 p-4 max-w-7xl mx-auto">
            {/* Header: Scoreboard */}
            <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-red-900/20 pointer-events-none" />

                <div className="text-center w-1/3 relative z-10">
                    <h2 className="text-2xl font-bold uppercase tracking-wider">{home.shortName}</h2>
                    <div className="text-7xl font-black text-blue-400 tabular-nums">{vb.score.home}</div>
                    <div className="text-xl mt-2 font-mono bg-white/10 inline-block px-3 py-1 rounded">SETS: {setsHome}</div>
                </div>

                <div className="flex flex-col items-center text-center w-1/3 relative z-10">
                    <div className="bg-yellow-500 text-black font-black px-4 py-1 rounded text-sm uppercase tracking-widest mb-2">
                        Set {vb.currentSet}
                    </div>
                    <div className="flex flex-col gap-1 bg-black/40 p-2 rounded w-full max-w-[200px]">
                        {vb.sets.map((s, i) => (
                            <div key={i} className="flex justify-between text-xs text-gray-300 font-mono">
                                <span>Set {i + 1}</span>
                                <span>{s.home} - {s.away}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center w-1/3 relative z-10">
                    <h2 className="text-2xl font-bold uppercase tracking-wider">{away.shortName}</h2>
                    <div className="text-7xl font-black text-red-500 tabular-nums">{vb.score.away}</div>
                    <div className="text-xl mt-2 font-mono bg-white/10 inline-block px-3 py-1 rounded">SETS: {setsAway}</div>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Home Controls */}
                <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-blue-900">
                            {home.name}
                            {vb.servingTeam === 'home' && <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">SERVING</span>}
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={() => submitTimeout('home')} className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs font-bold border" title="Timeout">
                                <Timer size={14} /> TO ({2 - vb.timeouts.home})
                            </button>
                            <button onClick={() => setShowSubModal('home')} className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs font-bold border" title="Substitution">
                                <UserPlus size={14} /> SUB
                            </button>
                            <button onClick={() => submitRotation('home')} className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs font-bold border" title="Manual Rotate">
                                <RotateCw size={14} /> ROT
                            </button>
                        </div>
                    </div>

                    <Court teamId="home" />

                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => handleStat('ace', 'home')} className="bg-green-100 text-green-900 p-3 rounded-lg hover:bg-green-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Trophy size={16} /> ACE
                        </button>
                        <button onClick={() => handleStat('kill', 'home')} className="bg-blue-100 text-blue-900 p-3 rounded-lg hover:bg-blue-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Skull size={16} /> KILL
                        </button>
                        <button onClick={() => handleStat('block', 'home')} className="bg-indigo-100 text-indigo-900 p-3 rounded-lg hover:bg-indigo-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Shield size={16} /> BLOCK
                        </button>
                        <button onClick={() => handleStat('dig', 'home')} className="bg-orange-100 text-orange-900 p-3 rounded-lg hover:bg-orange-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Activity size={16} /> DIG
                        </button>

                        <button onClick={() => handleStat('error', 'home')} className="bg-red-100 text-red-900 p-3 rounded-lg hover:bg-red-200 font-bold flex flex-col items-center gap-1 text-xs col-span-2">
                            <AlertTriangle size={16} /> ERROR
                        </button>
                        <button
                            onClick={() => submitPoint('home')}
                            className="bg-gray-100 text-gray-900 p-3 rounded-lg hover:bg-gray-200 font-bold flex flex-col items-center gap-1 text-xs col-span-2 border-2 border-gray-300"
                        >
                            + GENERIC POINT
                        </button>
                    </div>
                </div>

                {/* Away Controls */}
                <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-red-900">
                            {away.name}
                            {vb.servingTeam === 'away' && <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">SERVING</span>}
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={() => submitTimeout('away')} className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs font-bold border" title="Timeout">
                                <Timer size={14} /> TO ({2 - vb.timeouts.away})
                            </button>
                            <button onClick={() => setShowSubModal('away')} className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs font-bold border" title="Substitution">
                                <UserPlus size={14} /> SUB
                            </button>
                            <button onClick={() => submitRotation('away')} className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs font-bold border" title="Manual Rotate">
                                <RotateCw size={14} /> ROT
                            </button>
                        </div>
                    </div>

                    <Court teamId="away" />

                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => handleStat('ace', 'away')} className="bg-green-100 text-green-900 p-3 rounded-lg hover:bg-green-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Trophy size={16} /> ACE
                        </button>
                        <button onClick={() => handleStat('kill', 'away')} className="bg-red-100 text-red-900 p-3 rounded-lg hover:bg-red-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Skull size={16} /> KILL
                        </button>
                        <button onClick={() => handleStat('block', 'away')} className="bg-indigo-100 text-indigo-900 p-3 rounded-lg hover:bg-indigo-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Shield size={16} /> BLOCK
                        </button>
                        <button onClick={() => handleStat('dig', 'away')} className="bg-orange-100 text-orange-900 p-3 rounded-lg hover:bg-orange-200 font-bold flex flex-col items-center gap-1 text-xs">
                            <Activity size={16} /> DIG
                        </button>

                        <button onClick={() => handleStat('error', 'away')} className="bg-blue-100 text-blue-900 p-3 rounded-lg hover:bg-blue-200 font-bold flex flex-col items-center gap-1 text-xs col-span-2">
                            <AlertTriangle size={16} /> ERROR
                        </button>
                        <button
                            onClick={() => submitPoint('away')}
                            className="bg-gray-100 text-gray-900 p-3 rounded-lg hover:bg-gray-200 font-bold flex flex-col items-center gap-1 text-xs col-span-2 border-2 border-gray-300"
                        >
                            + GENERIC POINT
                        </button>
                    </div>
                </div>
            </div>

            {/* Config Panel Toggle */}
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                    <Settings size={24} />
                </button>
            </div>

            {/* Config Modal */}
            {showConfig && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-scale-up">
                        <h3 className="text-lg font-bold mb-4">Match Configuration</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Sets</label>
                                <div className="flex gap-2">
                                    {[3, 5].map(sets => (
                                        <button
                                            key={sets}
                                            onClick={() => updateVolleyballConfig({ ...vb.config, totalSets: sets as 3 | 5 })}
                                            className={`flex-1 py-2 rounded ${vb.config.totalSets === sets ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                                        >
                                            Best of {sets}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Points Per Set</label>
                                <input
                                    type="number"
                                    value={vb.config.pointsPerSet}
                                    onChange={(e) => updateVolleyballConfig({ ...vb.config, pointsPerSet: parseInt(e.target.value) || 25 })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Points Deciding Set</label>
                                <input
                                    type="number"
                                    value={vb.config.pointsDecidingSet}
                                    onChange={(e) => updateVolleyballConfig({ ...vb.config, pointsDecidingSet: parseInt(e.target.value) || 15 })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setShowConfig(false)}
                            className="w-full mt-6 bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Substitution Modal */}
            {showSubModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-[500px] animate-scale-up">
                        <h3 className="text-lg font-bold mb-4">Substitution - {showSubModal === 'home' ? home.name : away.name}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Player OUT (Must be selected from court, or we list court players) */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Player OUT</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {vb.rotations[showSubModal].map(pid => {
                                        const p = vb.teams[showSubModal].players.find(pl => pl.id === pid);
                                        return (
                                            <button
                                                key={pid}
                                                onClick={() => setSelectedPlayer({ teamId: showSubModal, playerId: pid })}
                                                className={`w-full text-left p-2 rounded text-sm flex justify-between ${selectedPlayer?.playerId === pid ? 'bg-red-100 border-red-500 border' : 'bg-gray-50 border border-transparent'}`}
                                            >
                                                <span>#{p?.number} {p?.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Player IN (Bench) */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-green-500 mb-2">Player IN</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {vb.teams[showSubModal].players
                                        .filter(p => !vb.rotations[showSubModal].includes(p.id))
                                        .map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 bg-white shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold text-gray-700">{p.number}</span>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900">{p.name}</span>
                                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full w-max ${p.position === 'L' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-500'}`}>
                                                            {p.position === 'L' ? 'LIBERO' : p.position}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleLibero(showSubModal, p.id, p.position)}
                                                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${p.position === 'L'
                                                            ? 'bg-yellow-500 text-white border-yellow-600'
                                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {p.position === 'L' ? 'UNMARK LIBERO' : 'MARK LIBERO'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (selectedPlayer?.playerId) {
                                                                handleSub(showSubModal, selectedPlayer.playerId, p.id);
                                                            } else {
                                                                alert("Select Player OUT first");
                                                            }
                                                        }}
                                                        className="bg-blue-600 text-white px-4 py-1 rounded text-xs font-bold hover:bg-blue-700 shadow-sm"
                                                    >
                                                        SUB IN
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSubModal(null)}
                            className="w-full mt-6 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
