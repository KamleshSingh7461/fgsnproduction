'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    homeScore: number;
    awayScore: number;
    className?: string;
}

export const MomentumMeter: React.FC<Props> = ({ homeScore, awayScore, className = "" }) => {
    const total = (homeScore + awayScore) || 1; // Prevent div by zero
    const homePercent = (homeScore / total) * 100;
    const awayPercent = 100 - homePercent;

    return (
        <div className={`w-full flex flex-col gap-2 ${className}`}>
            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-400 px-1">
                <span>Momentum Delta</span>
                <span>{Math.round(homePercent)}% vs {Math.round(awayPercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex border border-zinc-200 backdrop-blur-sm">
                <motion.div
                    initial={{ width: "50%" }}
                    animate={{ width: `${homePercent}%` }}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                />
                <motion.div
                    initial={{ width: "50%" }}
                    animate={{ width: `${awayPercent}%` }}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                    className="h-full bg-gradient-to-l from-red-600 to-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.2)]"
                />
            </div>
            {/* Real-time Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/40 border border-zinc-200 backdrop-blur-md z-10 hidden group-hover:block" />
        </div>
    );
};
