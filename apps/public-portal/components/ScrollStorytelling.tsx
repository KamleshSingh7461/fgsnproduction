'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card } from '@fgsn/ui';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface Service {
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    tags: string[];
    image?: string;
}

interface Props {
    services: Service[];
}

export const ScrollStorytelling: React.FC<Props> = ({ services }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile devices
        setIsMobile(window.innerWidth < 768);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Mobile: Simple card layout (no heavy animations)
    if (isMobile) {
        return (
            <div className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto space-y-8">
                    {services.map((service, index) => (
                        <Card key={index} className="p-6 border border-zinc-200">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${service.color}`}>
                                    {service.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-sm text-zinc-600 mb-3">{service.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.tags.map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-zinc-100 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Desktop: Full scroll animation experience
    return (
        <div ref={containerRef} className="relative h-[700vh]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white">
                {services.map((service, index) => (
                    <ServiceSlide
                        key={index}
                        service={service}
                        index={index}
                        total={services.length}
                        scrollYProgress={scrollYProgress}
                    />
                ))}
            </div>
        </div>
    );
};

interface SlideProps {
    service: Service;
    index: number;
    total: number;
    scrollYProgress: any;
}

const ServiceSlide: React.FC<SlideProps> = ({ service, index, total, scrollYProgress }) => {
    // Each slide occupies a portion of the scroll
    const start = index / total;
    const end = (index + 1) / total;

    // Opacity: Fade in early, fade out late
    const opacity = useTransform(
        scrollYProgress,
        [start, start + 0.05, end - 0.05, end],
        [0, 1, 1, 0]
    );

    // Z-Index: Ensure active slide is on top
    const zIndex = useTransform(
        scrollYProgress,
        [start, end],
        [1, 0]
    );

    // Scale: Subtle zoom in/out
    const scale = useTransform(
        scrollYProgress,
        [start, start + 0.1, end - 0.1, end],
        [0.9, 1, 1, 0.9]
    );

    // X Movement for parallax
    const xParallax = useTransform(
        scrollYProgress,
        [start, end],
        [100, -100]
    );

    // Image Zoom Effect
    const imageScale = useTransform(
        scrollYProgress,
        [start, end],
        [1.1, 1]
    );

    return (
        <motion.div
            style={{ opacity, scale, zIndex }}
            className="absolute inset-0 flex items-center justify-center p-6 md:p-12 pointer-events-none group"
        >
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center pointer-events-auto h-full lg:h-auto">
                <motion.div
                    style={{ x: xParallax }}
                    className="relative order-2 lg:order-1 z-30"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 blur-[150px] rounded-full animate-pulse`} />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`p-3 md:p-4 rounded-2xl bg-white border border-zinc-100 text-zinc-900 shadow-xl`}>
                                {service.icon}
                            </div>
                            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-zinc-200 to-transparent" />
                        </div>
                        <h2 className="text-4xl md:text-[5rem] lg:text-[8rem] font-black tracking-tighter uppercase italic leading-[0.9] md:leading-[0.8] mb-6 md:mb-12 text-zinc-900">
                            {service.title}
                        </h2>
                        <p className="text-sm md:text-xl lg:text-2xl text-zinc-400 font-bold uppercase tracking-tight leading-relaxed mb-6 md:mb-12 max-w-xl">
                            {service.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12">
                            {service.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover/text-white transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer group/link">
                            Enter the Vector <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </motion.div>

                <div className="relative h-[30vh] md:h-[40vh] lg:h-[70vh] w-full order-1 lg:order-2 mb-4 lg:mb-0">
                    <motion.div
                        initial={{ rotateY: 20, rotateX: 10 }}
                        whileHover={{ rotateY: 0, rotateX: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 bg-white border border-zinc-100 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.05)] flex items-center justify-center group"
                    >
                        {service.image ? (
                            <motion.img
                                src={service.image}
                                alt={service.title}
                                style={{ scale: imageScale }}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            />
                        ) : (
                            <>
                                {/* Procedural Grid Pattern */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px]" />

                                <div className="relative">
                                    <div className="scale-[5] opacity-5 blur-xl absolute inset-0 text-zinc-900">
                                        {service.icon}
                                    </div>
                                    <div className="scale-[3] text-zinc-200 drop-shadow-[0_0_50px_rgba(0,0,0,0.05)]">
                                        {service.icon}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Status Pulse */}
                        <div className="absolute bottom-12 left-12 flex items-center gap-3 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-200 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900/80">Node Sync: Active</div>
                        </div>

                        {/* Corner Accents */}
                        <div className={`absolute top-0 right-0 p-8 opacity-10 bg-gradient-to-bl ${service.color} w-32 h-32 rounded-bl-[100%]`} />
                    </motion.div>

                    {/* Tech Data Overlays */}
                    <div className="absolute -bottom-6 -right-6 p-10 bg-white/80 border border-zinc-200 rounded-[3rem] backdrop-blur-3xl hidden xl:block shadow-2xl">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">Latency</div>
                                <div className="text-2xl font-black tabular-nums text-zinc-900">0.04ms</div>
                            </div>
                            <div className="w-px h-10 bg-zinc-100" />
                            <div>
                                <div className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">Packet Stream</div>
                                <div className="text-2xl font-black tabular-nums italic text-zinc-900">ENCRYPTED</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
