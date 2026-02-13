import { Card, Button } from '@fgsn/ui';
import {
    ArrowRight, Trophy, Tv, Users, Activity, Calendar,
    Mic2, Presentation, Construction, Settings,
    MonitorPlay, ShieldCheck, MapPin, PlayCircle
} from 'lucide-react';
import { getLiveMatches } from '@/lib/actions';
import Link from 'next/link';
import { ScrollStorytelling } from '../components/ScrollStorytelling';
import { LiveScorePulse } from '../components/LiveScorePulse';
import { MomentumMeter } from '../components/MomentumMeter';
import { ScoreStrip } from '../components/ScoreStrip';
import { TransitionCamera } from '../components/TransitionCamera';

export default async function LandingPage() {
    const matches = await getLiveMatches();

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
            <nav className="border-b border-zinc-100 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50 bg-white/80">
                <div className="flex items-center gap-4">
                    <img
                        src="/FGSN-logo.png"
                        alt="FGSN Logo"
                        className="h-8 w-auto hover:scale-110 transition-transform cursor-pointer invert"
                    />
                    <div className="h-4 w-px bg-zinc-200 hidden md:block" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hidden md:block">
                        Precision Sports Network
                    </span>
                </div>
                <div className="hidden lg:flex gap-10 text-[11px] font-black text-zinc-400 tracking-widest uppercase">
                    <a href="#" className="hover:text-zinc-900 transition-all hover:tracking-[0.3em]">Live Scores</a>
                    <a href="#" className="hover:text-zinc-900 transition-all hover:tracking-[0.3em]">Tournaments</a>
                    <a href="#" className="hover:text-zinc-900 transition-all hover:tracking-[0.3em]">Our Services</a>
                    <a href="#" className="hover:text-zinc-900 transition-all hover:tracking-[0.3em]">About Us</a>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                            LIVE NETWORK
                        </span>
                    </div>
                </div>
            </nav>

            {/* Sticky Score Strip */}
            <ScoreStrip matches={matches} />

            {/* Hero Section */}
            <header className="relative pt-32 pb-48 px-6 text-center overflow-hidden border-b border-zinc-100 min-h-[90vh] flex items-center justify-center">
                {/* Cinematic Video Background */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-[0.2] transition-opacity duration-1000"
                    >
                        <source src="/images/services/hero-bg.mp4" type="video/mp4" />
                    </video>
                    {/* Professional HUD Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-40 z-10" />
                    <div className="absolute inset-0 opacity-[0.03] z-10"
                        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="max-w-6xl mx-auto relative z-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/5 backdrop-blur-md border border-zinc-200/20 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-8 animate-fade-in shadow-sm">
                        <Activity className="w-3 h-3 text-red-500" />
                        FGSN Professional Ecosystem v2.0
                    </div>
                    <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter mb-8 leading-[0.8] uppercase italic text-zinc-900 drop-shadow-sm">
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
                        <Button variant="secondary" size="lg" className="rounded-full px-16 h-16 border-zinc-200 text-zinc-900 text-sm font-black uppercase tracking-widest hover:bg-zinc-50 transition-all bg-white/80 backdrop-blur-sm">
                            View Blueprint
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* 3D Camera Fly-through Overlay */}
            <TransitionCamera />

            {/* Services Storytelling - "The FGSN Edge" */}
            <section className="bg-white relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10" />
                <ScrollStorytelling services={services} />
            </section>

            {/* Live Matches - "Center Stage" */}
            <section className="py-40 px-6 bg-white relative overflow-hidden">
                {/* Technical HUD Background Elements */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 left-0 w-full h-px bg-zinc-100" />
                <div className="absolute top-0 right-[20%] w-px h-full bg-zinc-100/50" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24 gap-12">
                        <div className="relative">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-zinc-900 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 shadow-xl">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                Live Score Engine // System.Active
                            </div>
                            <h2 className="text-[120px] font-black tracking-[-0.05em] uppercase italic leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-400">
                                Center<br />Stage
                            </h2>
                            <div className="absolute -left-12 top-1/2 -rotate-90 text-[10px] font-black text-zinc-200 uppercase tracking-[1em] whitespace-nowrap hidden lg:block">
                                Broadcast Protocol v4.2
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-6">
                            <p className="max-w-[300px] text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed hidden md:block">
                                Access the complete global data network for real-time telemetry and advanced match analytics across all active sporting sectors.
                            </p>
                            <Link href="/matches">
                                <Button className="group relative rounded-none px-16 py-8 bg-zinc-900 hover:bg-black text-white border-none overflow-hidden transition-all duration-500">
                                    <div className="absolute inset-0 w-1/2 bg-white/5 skew-x-[45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    <span className="relative z-10 font-black uppercase tracking-[0.3em] text-[10px]">
                                        View Data Network
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-100 border border-zinc-100 overflow-hidden rounded-[2px]">
                        {matches.length === 0 ? (
                            <div className="col-span-full py-48 text-center bg-white relative group">
                                <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,black_20px,black_21px)]" />
                                <div className="mb-8 flex justify-center relative">
                                    <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100 shadow-inner group-hover:scale-110 transition-transform duration-700">
                                        <Activity className="w-10 h-10 text-zinc-200" />
                                    </div>
                                    <div className="absolute top-0 right-1/2 translate-x-12 translate-y-[-10px]">
                                        <div className="px-2 py-0.5 bg-zinc-900 text-white text-[7px] font-black uppercase tracking-widest rounded-full">Offline</div>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter italic mb-3">Awaiting Uplink</h3>
                                <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em] max-w-sm mx-auto">
                                    No live transmissions currently detected within the high-speed synchronization matrix
                                </p>
                            </div>
                        ) : (
                            matches.map(m => (
                                <Link key={m.id} href={`/match/${m.id}`}>
                                    <Card variant="outline" className="p-12 group relative border-zinc-200 hover:border-red-600/40 transition-all duration-1000 overflow-hidden bg-white shadow-sm hover:shadow-2xl">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 grayscale">
                                            <Trophy className="w-48 h-48 rotate-12" />
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-16">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] font-black text-red-600/60 uppercase tracking-[0.5em]">{m.sport} Technical</span>
                                                    <span className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">{m.tournament.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {m.streamUrl && (
                                                        <div className="px-4 py-2 bg-red-600 text-white rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                                            <PlayCircle className="w-3 h-3" /> LIVE STREAM
                                                        </div>
                                                    )}
                                                    <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-md flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.status}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-10 flex-grow">
                                                {m.teams?.map((t, idx) => {
                                                    const liveData = JSON.parse(m.liveData);
                                                    const score = liveData.scoreSummary?.[`t${idx}`] || 0;
                                                    const otherScore = liveData.scoreSummary?.[`t${idx === 0 ? 1 : 0}`] || 0;

                                                    return (
                                                        <div key={t.id} className="flex flex-col gap-6 group/team">
                                                            <div className="flex justify-between items-center ">
                                                                <div className="flex items-center gap-8">
                                                                    <div className="w-20 h-20 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex items-center justify-center font-black text-3xl group-hover:border-red-500/30 transition-all duration-700 shadow-sm text-zinc-900">
                                                                        {t.team.name[0]}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className={`text-5xl font-black uppercase tracking-tighter ${idx > 0 ? 'text-zinc-300' : 'text-zinc-900'} group-hover/team:text-red-600 transition-colors duration-500`}>
                                                                            {t.team.name}
                                                                        </span>
                                                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Active Roster Matrix</span>
                                                                    </div>
                                                                </div>
                                                                <LiveScorePulse
                                                                    value={score}
                                                                    className="text-7xl md:text-8xl"
                                                                    teamColor={idx > 0 ? 'text-zinc-300' : 'text-zinc-900'}
                                                                />
                                                            </div>
                                                            {idx === 0 && (
                                                                <MomentumMeter
                                                                    homeScore={Number(score)}
                                                                    awayScore={Number(otherScore)}
                                                                    className="mt-2"
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Live Activity Ticker */}
                                            <div className="mt-8 px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl relative overflow-hidden group/ticker">
                                                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em]">
                                                    <span className="text-red-600 animate-pulse">● LIVE UPLINK</span>
                                                    <div className="flex-1 h-px bg-zinc-200" />
                                                    <span className="text-zinc-400">
                                                        {(JSON.parse(m.liveData).events?.[0]?.description || "Stable Transmission Active").toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-20 pt-10 border-t border-zinc-100 flex justify-between items-center text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-red-500" /> 18,920 SYNCED
                                                    </div>
                                                    <div className="w-1.5 h-1.5 bg-zinc-100 rounded-full" />
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-blue-500" /> 42ms LATENCY
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-zinc-900 opacity-20 group-hover:opacity-100 group-hover:text-red-600 transition-all duration-700">
                                                    OPEN DATA MATRIX <ArrowRight className="w-5 h-5" />
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

            {/* Technical Prowess */}
            <section className="py-32 px-6 bg-zinc-50 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-6xl font-black tracking-tighter mb-8 uppercase italic leading-none text-zinc-900">The Scoring <br />Live Engine</h2>
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
                <div className="max-w-4xl mx-auto text-center relative z-10 border border-zinc-100 bg-white p-20 rounded-[60px] shadow-2xl">
                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 uppercase italic text-zinc-900">Ready to Scale?</h2>
                    <p className="text-xl text-zinc-400 mb-12 font-medium">Join the network powering the future of global sports broadcasting and management.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Button className="h-16 px-12 rounded-full font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-[0_20px_30px_rgba(220,38,38,0.2)]">
                            Get Network Access
                        </Button>
                        <Button variant="secondary" className="h-16 px-12 rounded-full font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-50 text-zinc-900 bg-white">
                            Read the Blueprint
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-6 max-w-xs">
                        <img src="/FGSN-logo.png" alt="FGSN" className="h-6 w-auto grayscale invert" />
                        <p className="text-xs font-bold leading-relaxed text-zinc-400 uppercase tracking-widest">
                            Freedom Global Sports Network. <br />
                            Professional Monorepo V2.0.4 <br />
                            Built for Global Scale.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-[10px] font-black uppercase tracking-[0.2em]">
                        <div className="flex flex-col gap-4">
                            <span className="text-zinc-900">Solutions</span>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">Broadcasting</a>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">Operations</a>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">Analytics</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-zinc-900">Company</span>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">The Vision</a>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">Partners</a>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">Careers</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-zinc-900">Legal</span>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">Terms</a>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900">Privacy</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-100 flex justify-between items-center text-[10px] font-black text-zinc-300 uppercase tracking-widest">
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

