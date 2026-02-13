import { Card, Button } from '@fgsn/ui';
import {
    ArrowRight, Trophy, Tv, Users, Activity, Calendar,
    Mic2, Presentation, Construction, Settings,
    MonitorPlay, ShieldCheck, MapPin, PlayCircle
} from 'lucide-react';
import { getLiveMatches } from '@/lib/actions';
import Link from 'next/link';

export default async function LandingPage() {
    const matches = await getLiveMatches();

    const services = [
        {
            title: "Broadcasting",
            desc: "Professional-grade sports broadcasting with state-of-the-art technology.",
            icon: <Tv className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Hosting",
            desc: "Immersive event hosting and presentation services for global audiences.",
            icon: <Presentation className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Casting",
            desc: "Expert commentary and play-by-play analysis for every moment.",
            icon: <Mic2 className="w-6 h-6" />,
            color: "from-orange-500 to-red-500"
        },
        {
            title: "Fabrication",
            desc: "Custom set design and technical infrastructure for major leagues.",
            icon: <Construction className="w-6 h-6" />,
            color: "from-emerald-500 to-teal-500"
        },
        {
            title: "League Ops",
            desc: "End-to-end management of tournament life-cycles and operations.",
            icon: <Settings className="w-6 h-6" />,
            color: "from-amber-500 to-orange-500"
        },
        {
            title: "Scoring Live Engine",
            desc: "Ultra-low latency real-time scoring data for broadcasting and fans.",
            icon: <MonitorPlay className="w-6 h-6" />,
            color: "from-blue-600 to-indigo-600"
        },
        {
            title: "On Ground Operations",
            desc: "Professional venue management and technical logistics support.",
            icon: <MapPin className="w-6 h-6" />,
            color: "from-rose-500 to-red-500"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50 bg-black/40">
                <div className="flex items-center gap-4">
                    <img
                        src="/FGSN-logo.png"
                        alt="FGSN Logo"
                        className="h-8 w-auto hover:scale-110 transition-transform cursor-pointer"
                    />
                    <div className="h-4 w-px bg-white/10 hidden md:block" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hidden md:block">
                        Precision Sports Network
                    </span>
                </div>
                <div className="hidden lg:flex gap-10 text-[11px] font-black text-zinc-500 tracking-widest uppercase">
                    <a href="#" className="hover:text-white transition-all hover:tracking-[0.3em]">Live Scores</a>
                    <a href="#" className="hover:text-white transition-all hover:tracking-[0.3em]">Tournaments</a>
                    <a href="#" className="hover:text-white transition-all hover:tracking-[0.3em]">Our Services</a>
                    <a href="#" className="hover:text-white transition-all hover:tracking-[0.3em]">About Us</a>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                            LIVE NETWORK
                        </span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-48 px-6 text-center overflow-hidden border-b border-white/5">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8 animate-fade-in">
                        <Activity className="w-3 h-3 text-red-500" />
                        Next-Gen Sports Ecosystem
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
                        DOMINATING THE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-600">
                            DIGITAL ARENA
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Unified micro-services for broadcast-grade scoring,
                        real-time analytics, and futuristic event coverage.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="rounded-full px-12 h-14 bg-white text-black hover:bg-zinc-200 text-sm font-black uppercase tracking-widest group">
                            Watch Live Now
                            <PlayCircle className="ml-2 h-5 w-5 fill-black group-hover:scale-110 transition-transform" />
                        </Button>
                        <Button variant="secondary" size="lg" className="rounded-full px-12 h-14 border-white/10 backdrop-blur-md text-sm font-black uppercase tracking-widest hover:bg-white/5">
                            Partner with Us
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Hero Decoration - Abstract Shape */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600 mix-blend-screen rounded-full blur-[180px] animate-pulse" />
                </div>
            </header>

            {/* Services Grid - "The FGSN Edge" */}
            <section className="py-32 px-6 bg-zinc-950/50 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black tracking-tight mb-4 uppercase italic">The FGSN Edge</h2>
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">Complete End-to-End Sports Solutions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((service, idx) => (
                            <Card key={idx} variant="glass" className={`group relative p-8 h-full border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden ${idx === 0 ? 'lg:col-span-2' : ''}`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                                        <div className="text-white group-hover:text-red-500 transition-colors">
                                            {service.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black mb-3 uppercase tracking-tight group-hover:translate-x-1 transition-transform">{service.title}</h3>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6 group-hover:text-zinc-400 transition-colors">
                                        {service.desc}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors cursor-pointer">
                                        Explore Solution <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Matches - "Center Stage" */}
            <section className="py-32 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 mb-4">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                Live Score Engine
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter uppercase italic">Center Stage</h2>
                        </div>
                        <Link href="/matches">
                            <Button variant="secondary" className="rounded-full px-8 border-white/10 font-black uppercase tracking-widest text-xs h-12">
                                All Live Events
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {matches.length === 0 ? (
                            <div className="col-span-full py-40 text-center bg-zinc-950 rounded-[40px] border border-white/5 border-dashed">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                                        <Activity className="w-10 h-10 text-zinc-700" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest">Awaiting Kickoff</h3>
                                <p className="text-zinc-700 font-bold text-xs uppercase tracking-widest mt-2">No live matches currently in high-speed sync</p>
                            </div>
                        ) : (
                            matches.map(m => (
                                <Link key={m.id} href={`/match/${m.id}`}>
                                    <Card variant="glass" className="p-10 group relative border-white/5 hover:border-red-500/20 transition-all duration-700 overflow-hidden bg-zinc-950/40">
                                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Trophy className="w-32 h-32 rotate-12" />
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-12">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{m.sport} Elite</span>
                                                    <span className="text-lg font-black uppercase italic tracking-tight">{m.tournament.name}</span>
                                                </div>
                                                <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{m.status}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-10 flex-grow">
                                                {m.teams?.map((t, idx) => (
                                                    <div key={t.id} className="flex justify-between items-center">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center font-black text-2xl group-hover:bg-white/10 transition-all">
                                                                {t.team.name[0]}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className={`text-4xl font-black uppercase tracking-tighter ${idx > 0 ? 'text-zinc-500' : 'text-white'}`}>
                                                                    {t.team.name}
                                                                </span>
                                                                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Active Roster</span>
                                                            </div>
                                                        </div>
                                                        <div className={`text-6xl font-black tabular-nums tracking-tighter ${idx > 0 ? 'text-zinc-700' : 'text-white'} group-hover:text-red-500 transition-colors`}>
                                                            {JSON.parse(m.liveData).scoreSummary?.[`t${idx}`] || 0}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-zinc-600 tracking-widest uppercase">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3 h-3" /> 12.4K Watching
                                                    </div>
                                                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-3 h-3" /> 98ms Sync
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-white opacity-40 group-hover:opacity-100 group-hover:text-red-500 transition-all">
                                                    Open Data Matrix <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-48 px-6 bg-zinc-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/5 blur-[120px] rounded-full translate-y-1/2 scale-150" />
                <div className="max-w-4xl mx-auto text-center relative z-10 border border-white/5 bg-black/40 p-20 rounded-[60px] backdrop-blur-3xl shadow-2xl">
                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic">Ready to Scale?</h2>
                    <p className="text-xl text-zinc-500 mb-12 font-medium">Join the network powering the future of global sports broadcasting and management.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Button className="h-16 px-12 rounded-full font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                            Get Network Access
                        </Button>
                        <Button variant="secondary" className="h-16 px-12 rounded-full font-black uppercase tracking-widest border-white/10 hover:bg-white/5">
                            Read the Blueprint
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-6 max-w-xs">
                        <img src="/FGSN-logo.png" alt="FGSN" className="h-6 w-auto grayscale" />
                        <p className="text-xs font-bold leading-relaxed text-zinc-500 uppercase tracking-widest">
                            Freedom Global Sports Network. <br />
                            Professional Monorepo V2.0.4 <br />
                            Built for Global Scale.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-[10px] font-black uppercase tracking-[0.2em]">
                        <div className="flex flex-col gap-4">
                            <span className="text-white">Solutions</span>
                            <a href="#" className="text-zinc-600 hover:text-white">Broadcasting</a>
                            <a href="#" className="text-zinc-600 hover:text-white">Operations</a>
                            <a href="#" className="text-zinc-600 hover:text-white">Analytics</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-white">Company</span>
                            <a href="#" className="text-zinc-600 hover:text-white">The Vision</a>
                            <a href="#" className="text-zinc-600 hover:text-white">Partners</a>
                            <a href="#" className="text-zinc-600 hover:text-white">Careers</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-white">Legal</span>
                            <a href="#" className="text-zinc-600 hover:text-white">Terms</a>
                            <a href="#" className="text-zinc-600 hover:text-white">Privacy</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-zinc-800 uppercase tracking-widest">
                    <span>&copy; 2026 FGSN Universal.</span>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Secure Sync</span>
                        <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> 99.9% Uptime</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}

