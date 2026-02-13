'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiveScorePulse } from './LiveScorePulse';
import { Activity } from 'lucide-react';
import Link from 'next/link';

interface Match {
    id: string;
    sport: string;
    status: string;
    teams: {
        team: {
            name: string;
            shortName?: string;
        };
    }[];
    liveData: string;
    tournament: {
        name: string;
    };
}

interface Props {
    matches: Match[];
}

export const ScoreStrip: React.FC<Props> = ({ matches }) => {
    if (!matches || matches.length === 0) return null;

    return (
        <div className="w-full bg-white/90 backdrop-blur-2xl border-b border-zinc-100 sticky top-[60px] md:top-[80px] z-[40] h-10 md:h-12 flex items-center overflow-hidden group/strip">
            {/* HUD Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Live Pulse Indicator - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 px-4 lg:px-6 border-r border-zinc-100 h-full bg-zinc-50/50 relative z-10">
                <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-[4px] animate-ping opacity-20" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900/80 whitespace-nowrap">Live Pulse</span>
            </div>

            {/* Mobile Live Indicator - Only visible on mobile */}
            <div className="flex md:hidden items-center gap-2 px-3 border-r border-zinc-100 h-full bg-zinc-50/50 relative z-10">
                <div className="relative">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-[4px] animate-ping opacity-20" />
                </div>
            </div>

            <div className="relative flex-1 h-full overflow-hidden">
                <div
                    className="flex-1 overflow-x-auto no-scrollbar flex items-center h-full relative"
                >
                    <div className="flex items-center h-full">
                        {matches.map((match, idx) => {
                            const liveData = JSON.parse(match.liveData);
                            const homeTeam = match.teams[0]?.team;
                            const awayTeam = match.teams[1]?.team;
                            const homeScore = liveData.scoreSummary?.t0 || 0;
                            const awayScore = liveData.scoreSummary?.t1 || 0;

                            return (
                                <Link
                                    key={match.id}
                                    href={`/match/${match.id}`}
                                    className="flex items-center px-4 md:px-8 lg:px-10 border-r border-zinc-100 hover:bg-zinc-50 transition-all h-full group/item relative overflow-hidden shrink-0"
                                >
                                    {/* Subtly animated ticker background on hover */}
                                    <div className="absolute inset-0 bg-indigo-50/0 group-hover/item:bg-indigo-50/50 transition-colors" />

                                    <div className="flex items-center gap-2 md:gap-4 relative z-10">
                                        {/* Sport Label - Hidden on mobile */}
                                        <div className="hidden md:flex flex-col">
                                            <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none mb-1">{match.sport}</span>
                                            <div className="h-0.5 w-0 group-hover/item:w-full bg-indigo-500/20 transition-all duration-500" />
                                        </div>

                                        <div className="flex items-center gap-2 md:gap-4">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <span className="text-[11px] md:text-[12px] font-black uppercase tracking-tight text-zinc-900 group-hover/item:text-indigo-600 transition-colors">
                                                    {homeTeam.shortName || homeTeam.name.substring(0, 3)}
                                                </span>
                                                <LiveScorePulse
                                                    value={homeScore}
                                                    className="text-[11px] md:text-[12px]"
                                                    teamColor="text-indigo-600"
                                                />
                                            </div>
                                            <span className="text-zinc-200 text-[9px] md:text-[10px] font-black group-hover/item:scale-150 transition-transform tracking-widest mx-0.5 md:mx-1 opacity-50">VS</span>
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <LiveScorePulse
                                                    value={awayScore}
                                                    className="text-[11px] md:text-[12px]"
                                                    teamColor="text-zinc-400"
                                                />
                                                <span className="text-[11px] md:text-[12px] font-black uppercase tracking-tight text-zinc-400 group-hover/item:text-zinc-900 transition-colors">
                                                    {awayTeam.shortName || awayTeam.name.substring(0, 3)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status - Hidden on mobile, shown on hover on desktop */}
                                        <div className="hidden md:flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all translate-x-4 group-hover/item:translate-x-0 ml-2">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                            <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">{match.status}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Uplink Status - Simplified on mobile */}
            <div className="px-3 md:px-6 border-l border-zinc-100 h-full flex items-center gap-2 md:gap-3 bg-zinc-50/50 relative z-10 group/status cursor-help">
                <div className="relative">
                    <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 text-zinc-300 group-hover/status:text-indigo-500 transition-colors" />
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 text-indigo-500 blur-[2px]"
                    >
                        <Activity className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    </motion.div>
                </div>
                <span className="hidden md:inline text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] group-hover/status:text-zinc-900 transition-colors">Uplink: Primary</span>
            </div>
        </div>
    );
};
