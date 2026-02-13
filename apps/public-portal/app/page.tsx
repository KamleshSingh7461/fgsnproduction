import { Card, Button } from '@fgsn/ui';
import { ArrowRight, Trophy, Tv, Users, Activity, Calendar } from 'lucide-react';
import { getLiveMatches } from '@/lib/actions';
import Link from 'next/link';

export default async function LandingPage() {
    const matches = await getLiveMatches();
    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="border-b border-white/10 p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 bg-black/50">
                <img
                    src="/FGSN-logo.png"
                    alt="FGSN Logo"
                    className="h-8 w-auto"
                />
                <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">LIVE SCORES</a>
                    <a href="#" className="hover:text-white transition-colors">TOURNAMENTS</a>
                    <a href="#" className="hover:text-white transition-colors">NEWS</a>
                    <a href="#" className="hover:text-white transition-colors">ABOUT</a>
                </div>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Network Active
                    </span>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-red-900/10" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                        THE FUTURE OF SPORTS
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
                        UNLEASH YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">POTENTIAL</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Experience sports like never before. Real-time stats, immersive broadcasts, and professional tournament management.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="rounded-full px-8">
                            Watch Live <Tv className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="lg" className="rounded-full px-8">
                            View Stats <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Live Matches Section */}
            <section className="py-24 px-6 bg-black relative">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                                <Activity className="w-8 h-8 text-red-500 animate-pulse" /> Live Now
                            </h2>
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">Real-time action from around the world</p>
                        </div>
                        <Link href="/matches">
                            <Button variant="secondary" className="text-xs font-black uppercase tracking-widest border-white/10">
                                View All Matches
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.length === 0 ? (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl">
                                <p className="text-zinc-500 font-black uppercase tracking-widest italic">No matches live at the moment</p>
                            </div>
                        ) : (
                            matches.map(m => (
                                <Link key={m.id} href={`/match/${m.id}`}>
                                    <Card variant="glass" className="p-6 group hover:border-indigo-500/50 transition-all duration-500">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="px-2 py-0.5 bg-zinc-800 rounded text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                                {m.sport}
                                            </div>
                                            <div className="flex items-center gap-2 text-red-500">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-wider">{m.status}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {m.teams && m.teams.length >= 2 ? (
                                                <>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-black text-lg uppercase tracking-tight">
                                                            {m.teams.find(t => t.displayOrder === 0)?.team.name || m.teams[0].team.name}
                                                        </span>
                                                        <span className="text-2xl font-black text-white">
                                                            {JSON.parse(m.liveData).scoreSummary?.home || JSON.parse(m.liveData).scoreSummary?.t0 || 0}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-px bg-white/5" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-black text-lg uppercase tracking-tight text-zinc-400">
                                                            {m.teams.find(t => t.displayOrder === 1)?.team.name || m.teams[1].team.name}
                                                        </span>
                                                        <span className="text-2xl font-black text-zinc-500">
                                                            {JSON.parse(m.liveData).scoreSummary?.away || JSON.parse(m.liveData).scoreSummary?.t1 || 0}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {m.teams?.map((t, idx) => (
                                                        <div key={t.id} className="flex justify-between items-center">
                                                            <span className={`font-black text-lg uppercase tracking-tight ${idx > 0 ? 'text-zinc-400' : ''}`}>
                                                                {t.team.name}
                                                            </span>
                                                            <span className={`text-2xl font-black ${idx > 0 ? 'text-zinc-500' : 'text-white'}`}>
                                                                {JSON.parse(m.liveData).scoreSummary?.[`t${idx}`] || 0}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase">
                                                <Calendar className="w-3 h-3" />
                                                {m.tournament.name}
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 bg-zinc-950">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card variant="glass" className="hover:-translate-y-1 duration-300">
                        <div className="h-12 w-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6 text-indigo-400">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Live Tournaments</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Real-time tracking of every match, every score, and every moment as it happens.
                        </p>
                    </Card>
                    <Card variant="glass" className="hover:-translate-y-1 duration-300">
                        <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6 text-red-400">
                            <Tv className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Pro Broadcasts</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Television-grade overlays and graphics for a premium viewing experience.
                        </p>
                    </Card>
                    <Card variant="glass" className="hover:-translate-y-1 duration-300">
                        <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 text-orange-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Connect with athletes, fans, and organizers in a unified ecosystem.
                        </p>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center text-gray-600 text-sm">
                &copy; 2024 FGSN. Built on Microservices.
            </footer>
        </div>
    );
}
