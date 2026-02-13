'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const TransitionCamera: React.FC = () => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Use target ref for precise scroll tracking at the transition point
    const { scrollYProgress } = useScroll({
        target: anchorRef,
        offset: ["start end", "end start"]
    });

    // Smoothen the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.001
    });

    // Precise Fly-through transformations relative to the anchor
    // 0.0 -> Entry (start scroll)
    // 0.5 -> Midpoint (center of transition)
    // 1.0 -> Exit (end scroll)
    const scale = useTransform(smoothProgress, [0.4, 0.7, 1], [0.5, 1, 8]);
    const opacity = useTransform(smoothProgress, [0.4, 0.5, 0.8, 1], [0, 1, 1, 0]);
    const rotateX = useTransform(smoothProgress, [0.4, 1], [20, -20]);
    const z = useTransform(smoothProgress, [0.4, 1], [-200, 2000]);
    const y = useTransform(smoothProgress, [0.4, 1], [300, -300]);

    if (!mounted) return null;

    return (
        <div ref={anchorRef} className="relative h-px w-full pointer-events-none -mt-40">
            <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{
                        scale,
                        opacity,
                        rotateX,
                        z,
                        y,
                        perspective: 1500,
                    }}
                    className="relative flex flex-col items-center"
                >
                    {/* Provided 3D Camera Image */}
                    <motion.img
                        src="/images/services/3d camera.png"
                        alt="3D Broadcast Camera"
                        className="w-[450px] lg:w-[600px] h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.2)] relative z-10"
                    />

                    {/* Technical HUD Overlays (SVG) */}
                    <svg
                        width="800"
                        height="600"
                        viewBox="0 0 800 600"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0 z-20 pointer-events-none"
                    >
                        {/* Scanning Line HUD */}
                        <motion.line
                            x1="100" y1="100" x2="700" y2="100"
                            stroke="#ef4444" strokeWidth="2" opacity="0.4"
                            animate={{ y: [0, 400, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Corner Brackets - Industrial Style */}
                        <path d="M50 50H150M50 50V150" stroke="#a1a1aa" strokeWidth="3" />
                        <path d="M650 50H750M750 50V150" stroke="#a1a1aa" strokeWidth="3" />
                        <path d="M50 550H150M50 550V450" stroke="#a1a1aa" strokeWidth="3" />
                        <path d="M650 550H750M750 550V450" stroke="#a1a1aa" strokeWidth="3" />

                        {/* HUD Labels */}
                        <text x="70" y="40" fill="#71717a" fontSize="10" fontWeight="900" style={{ letterSpacing: '0.2em' }}>UPLINK_PRIMARY: ESTABLISHED</text>
                        <text x="70" y="580" fill="#ef4444" fontSize="10" fontWeight="900" style={{ letterSpacing: '0.2em' }} opacity="0.8">REC // FGSN_CORE.LIVE</text>
                        <text x="650" y="40" fill="#10b981" fontSize="10" fontWeight="900">4K_ULTRA</text>
                    </svg>

                    {/* Telemetry HUD Labels */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-12 flex flex-col items-center gap-3">
                        <div className="h-px w-32 bg-zinc-200/50" />
                        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.8em] whitespace-nowrap">
                            Synchronizing Uplink
                        </span>
                        <div className="flex gap-8 mt-4">
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-zinc-300">LATENCY</span>
                                <span className="text-[12px] font-black text-emerald-500 tabular-nums">14ms</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-zinc-300">BITRATE</span>
                                <span className="text-[12px] font-black text-indigo-500 tabular-nums">480MB/S</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
