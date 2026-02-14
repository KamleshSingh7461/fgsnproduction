'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const TransitionCamera: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll through the 150vh zone as it passes the viewport center
    // This gives us exactly 150vh of scrollable range to play the animation.
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    // Smoothen the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.001
    });

    // Sequential Animation Transformations
    // Mapped to the clear 0 -> 1 window of the transition zone.

    // Scale: 0.5 -> 1 -> 15
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.5, 1, 15]);

    // Opacity: Fade in quickly at start, fade out by the end
    const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    // Rotation: Natural camera tilt
    const rotateX = useTransform(smoothProgress, [0, 1], [20, -20]);

    // Depth (Z): Cinematic push
    const z = useTransform(smoothProgress, [0, 1], [-200, 4000]);

    // Vertical Offset (Y): Smooth lift
    const y = useTransform(smoothProgress, [0, 1], [300, -300]);

    return (
        <div ref={containerRef} className="relative w-full h-[150vh] pointer-events-none z-50 overflow-visible">
            {/* The 150vh height ensures we have a real scroll duration for the cinematic. */}

            <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden">
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
                    {/* The 3D Camera Asset */}
                    <motion.img
                        src="/images/services/3d camera.png"
                        alt="3D Broadcast Camera"
                        className="w-[350px] md:w-[600px] h-auto drop-shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative z-10"
                    />

                    {/* Technical HUD Overlays */}
                    <svg
                        width="800"
                        height="600"
                        viewBox="0 0 800 600"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0 z-20 pointer-events-none opacity-60 scale-75 md:scale-100"
                    >
                        {/* Scanning Line HUD */}
                        <motion.line
                            x1="100" y1="100" x2="700" y2="100"
                            stroke="#ef4444" strokeWidth="2" opacity="0.4"
                            animate={{ y: [0, 400, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Corner Brackets */}
                        <path d="M50 50H150M50 50V150" stroke="#a1a1aa" strokeWidth="3" />
                        <path d="M650 50H750M750 50V150" stroke="#a1a1aa" strokeWidth="3" />
                        <path d="M50 550H150M50 550V450" stroke="#a1a1aa" strokeWidth="3" />
                        <path d="M650 550H750M750 550V450" stroke="#a1a1aa" strokeWidth="3" />

                        <text x="70" y="40" fill="#71717a" fontSize="10" fontWeight="900" style={{ letterSpacing: '0.2em' }}>UPLINK_PRIMARY: ESTABLISHED</text>
                        <text x="70" y="580" fill="#ef4444" fontSize="10" fontWeight="900" style={{ letterSpacing: '0.2em' }}>REC // FGSN_CORE.LIVE</text>
                        <text x="650" y="40" fill="#10b981" fontSize="10" fontWeight="900">4K_ULTRA</text>
                    </svg>

                    {/* Telemetry Data HUD Labels */}
                    <div className="absolute top-[110%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 scale-75 md:scale-100 opacity-60">
                        <div className="h-px w-48 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.8em] whitespace-nowrap">
                            Synchronizing Uplink
                        </span>
                        <div className="flex gap-12 mt-4">
                            <div className="text-center">
                                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">LATENCY</p>
                                <p className="text-[14px] font-black text-emerald-500 tabular-nums">14ms</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">BITRATE</p>
                                <p className="text-[14px] font-black text-indigo-500 tabular-nums">480MB/S</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
