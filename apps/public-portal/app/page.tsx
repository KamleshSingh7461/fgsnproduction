'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, Button } from '@fgsn/ui';
import {
    ArrowRight, Trophy, Tv, Users, Activity, Calendar,
    Mic2, Presentation, Construction, Settings,
    MonitorPlay, ShieldCheck, MapPin, PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LiveScoreStripWrapper } from '../components/LiveScoreStripWrapper';

// Dynamically import heavy interactive components (Client-side only)
const ScrollStorytelling = dynamic(() => import('@/components/ScrollStorytelling').then(mod => mod.ScrollStorytelling), {
    ssr: false,
    loading: () => <div className="h-[400vh] bg-white" />
});

const TransitionCamera = dynamic(() => import('@/components/TransitionCamera'), {
    ssr: false
});

export default function LandingPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const services = [
        {
            title: "Broadcasting",
            desc: "Next-gen 4K UHD remote production and cloud-based broadcasting workflows. Our systems handle everything from signal acquisition to final multi-platform delivery.",
            icon: <Tv className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500",
            tags: ["4K UHD", "Cloud-Link", "Remote Ops"],
            image: "/images/services/broadcasting.png"
        },
        {
            title: "Hosting & Presentation",
            desc: "Global-scale event hosting for elite sports. We provide the digital and physical infrastructure to entertain millions across every touchpoint.",
            icon: <Presentation className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500",
            tags: ["Global Scale", "VOD", "Fan Engagement"],
            image: "/images/services/hosting.png"
        },
        {
            title: "Expert Casting",
            desc: "The voice of the game. Our casting network features world-class commentary and technical analysis that brings every play to life.",
            icon: <Mic2 className="w-6 h-6" />,
            color: "from-orange-500 to-red-500",
            tags: ["Expert VO", "Strategy Talk", "Live Hype"]
        },
        {
            title: "Technical Fabrication",
            desc: "Building the arenas of tomorrow. Custom set design, LED integration, and specialized technical infrastructure for premier leagues.",
            icon: <Construction className="w-6 h-6" />,
            color: "from-emerald-500 to-teal-500",
            tags: ["LED Sets", "Custom Build", "Arena Tech"],
            image: "/images/services/fabrication.png"
        },
        {
            title: "League Operations",
            desc: "Complete administrative control. Manage seasons, drafts, rule-sets, and player associations with industrial-grade precision.",
            icon: <Settings className="w-6 h-6" />,
            color: "from-amber-500 to-orange-500",
            tags: ["Season Mgmt", "Draft Engine", "Rule-Set Logic"]
        },
        {
            title: "Scoring Live Engine",
            desc: "The pulse of the match. Ultra-low latency data synchronization (<100ms) powering the world's most demanding sports broadcasts.",
            icon: <MonitorPlay className="w-6 h-6" />,
            color: "from-blue-600 to-indigo-600",
            tags: ["Low Latency", "99.9% Uptime", "JSON-Realtime"],
            image: "/images/services/scoring.png"
        },
        {
            title: "On Ground Operations",
            desc: "Boots on the ground. Venue management, technical logistics, and hardware deployment for high-stakes tournament environments.",
            icon: <MapPin className="w-6 h-6" />,
            color: "from-rose-500 to-red-500",
            tags: ["Venue Logistics", "Hardware Deploy", "On-Site Support"],
            image: "/images/services/venue.png"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01] grayscale" />
            </div>

            {/* Navbar */}
            <Navbar />



            {/* Sticky Score Strip */}
            <LiveScoreStripWrapper />

            {/* Hero Section */}
            <header className="relative pt-32 pb-48 px-6 text-center overflow-hidden border-b border-zinc-100 min-h-[90vh] flex items-center justify-center">
                {/* Cinematic Video Background - Desktop Only */}
                <div className="absolute inset-0 z-0">
                    {/* Mobile: Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 md:hidden" />

                    {/* Desktop: Video Background */}
                    {!isMobile && (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-[0.6] transition-opacity duration-1000"
                        >
                            <source src="https://dv7mu684h1zb9.cloudfront.net/hero-bg.mp4" type="video/mp4" />
                        </video>
                    )}
                    {/* Professional HUD Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80 z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-20 z-10" />
                    <div className="absolute inset-0 opacity-[0.03] z-10"
                        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="max-w-6xl mx-auto relative z-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/5 backdrop-blur-md border border-zinc-200/20 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-8 animate-fade-in shadow-sm">
                        <Activity className="w-3 h-3 text-red-500" />
                        FGSN Professional Ecosystem v2.0
                    </div>
                    <h1 className="text-5xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter mb-8 leading-[0.9] md:leading-[0.8] uppercase italic text-zinc-900 drop-shadow-sm">
                        The Future <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-400">
                            Is Live.
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-500 mb-12 max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-tight">
                        Powering global sports franchises with broadcast-grade
                        <span className="text-zinc-900 mx-1">real-time scoring</span>,
                        <span className="text-zinc-900 mx-1">cloud production</span>, and
                        <span className="text-zinc-900 mx-1">on-ground mastery</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="rounded-full px-16 h-16 bg-red-600 text-white hover:bg-red-700 text-sm font-black uppercase tracking-widest group shadow-[0_20px_40px_rgba(220,38,38,0.2)] border-0">
                            Enter the Network
                            <PlayCircle className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                        </Button>
                        <Button variant="secondary" size="lg" className="rounded-full px-16 h-16 border-zinc-200 text-white text-sm font-black uppercase tracking-widest hover:bg-zinc-50 transition-all bg-white/80 backdrop-blur-sm">
                            View Blueprint
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Transition Space */}
            <div className="h-40 bg-white" />

            {/* 3D Camera Fly-through Overlay */}
            <TransitionCamera />

            {/* Services Storytelling - "The FGSN Edge" */}
            <section className="bg-white relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10" />
                <ScrollStorytelling services={services} />
            </section>


            {/* Portfolio Section - Past Events */}
            <section className="py-32 px-6 bg-white border-t border-zinc-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-zinc-900 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 shadow-xl">
                            <Activity className="w-3 h-3 text-red-500" />
                            Portfolio
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-zinc-900 mb-6">
                            Events We've <br className="md:hidden" />Powered
                        </h2>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
                            From grassroots tournaments to professional leagues, we've delivered broadcast-grade experiences across the globe.
                        </p>
                    </div>


                    {/* Infinite Logo Marquee */}
                    <div className="relative overflow-hidden">
                        {/* Gradient Overlays */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                        {/* Marquee Container */}
                        <div className="flex gap-16 animate-marquee">
                            {/* Logo 1 */}
                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 1</span>
                            </div>

                            {/* Logo 2 */}
                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 2</span>
                            </div>

                            {/* Logo 3 */}
                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 3</span>
                            </div>

                            {/* Logo 4 */}
                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 4</span>
                            </div>

                            {/* Logo 5 */}
                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 5</span>
                            </div>

                            {/* Logo 6 */}
                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 6</span>
                            </div>

                            {/* Duplicate set for seamless loop */}
                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 1</span>
                            </div>

                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 2</span>
                            </div>

                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 3</span>
                            </div>

                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 4</span>
                            </div>

                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 5</span>
                            </div>

                            <div className="flex-shrink-0 h-24 w-48 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center px-8 shadow-sm hover:shadow-lg transition-shadow">
                                <span className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Event 6</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Prowess */}
            <section className="py-32 px-6 bg-zinc-50 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase italic leading-none text-zinc-900">The Scoring <br />Live Engine</h2>
                            <p className="text-xl text-zinc-500 mb-10 leading-relaxed font-medium">
                                Our proprietary real-time engine is built for the zero-latency era.
                                Using a high-speed WebSocket relay and strictly typed DTOs, we synchronize match states
                                globally in under 100ms.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-white rounded-2xl border border-zinc-100 hover:border-indigo-500/30 transition-colors shadow-sm">
                                    <div className="text-3xl font-black mb-1 text-zinc-900">0.1s</div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Latency</div>
                                </div>
                                <div className="p-6 bg-white rounded-2xl border border-zinc-100 hover:border-red-500/30 transition-colors shadow-sm">
                                    <div className="text-3xl font-black mb-1 text-zinc-900">99.9%</div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Uptime SLA</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-600/5 blur-[100px] rounded-full animate-pulse" />
                            <Card variant="outline" className="relative p-8 border-zinc-200 aspect-video flex items-center justify-center overflow-hidden group bg-white shadow-xl">
                                <div className="text-center">
                                    <Activity className="w-20 h-20 text-red-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="text-sm font-black uppercase tracking-[0.3em] text-zinc-900">System Telemetry Active</div>
                                </div>
                                <div className="absolute inset-0 pointer-events-none opacity-20">
                                    <div className="h-px w-full bg-zinc-400 absolute top-1/4 animate-scan" style={{ animationDelay: '0s' }} />
                                    <div className="h-px w-full bg-zinc-400 absolute top-2/4 animate-scan" style={{ animationDelay: '1.5s' }} />
                                    <div className="h-px w-full bg-zinc-400 absolute top-3/4 animate-scan" style={{ animationDelay: '3s' }} />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-48 px-6 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/5 blur-[120px] rounded-full translate-y-1/2 scale-150" />
                <div className="max-w-4xl mx-auto text-center relative z-10 border border-zinc-100 bg-white p-10 md:p-20 rounded-[40px] md:rounded-[60px] shadow-2xl">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic text-zinc-900">Ready to Scale?</h2>
                    <p className="text-xl text-zinc-400 mb-12 font-medium">Join the network powering the future of global sports broadcasting and management.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Button className="h-16 px-12 rounded-full font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-[0_20px_30px_rgba(220,38,38,0.2)]">
                            Get Network Access
                        </Button>
                        <Button variant="secondary" className="h-16 px-12 rounded-full font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-50 text-white bg-white">
                            Read the Blueprint
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* Footer */}
            <Footer />

        </div>
    );
}

