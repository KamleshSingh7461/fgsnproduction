'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    value: string | number;
    className?: string;
    teamColor?: string;
}

export const LiveScorePulse: React.FC<Props> = ({ value, className = "", teamColor = "text-zinc-900" }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setIsUpdating(true);
            const timer = setTimeout(() => {
                setDisplayValue(value);
                setIsUpdating(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [value, displayValue]);

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={displayValue}
                    initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className={`tabular-nums font-black ${teamColor} relative z-10`}
                >
                    {displayValue}
                </motion.span>
            </AnimatePresence>

            {/* Live Update Glow */}
            <AnimatePresence>
                {isUpdating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.4, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute inset-0 bg-red-500/20 blur-xl rounded-full z-0"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
