
import { Card } from '@fgsn/ui';
import { Trophy, PlayCircle, Users, Activity, ArrowRight, Calendar } from 'lucide-react';
import { getAllMatches } from '@/lib/actions';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { LiveScorePulse } from '../../components/LiveScorePulse';
import { MomentumMeter } from '../../components/MomentumMeter';

export default async function MatchesPage() {
    const matches = await getAllMatches();

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01] grayscale" />
            </div>

            {/* Navbar */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <header className="mb-20">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-zinc-900 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 shadow-xl">
                        <Activity className="w-3 h-3 text-red-500" />
                        Global Match Feed
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 mb-6">
                        All <br /> Matches
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl font-bold uppercase tracking-tight">
                        Real-time telemetry and historical data from the FGSN global network.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-12">
                    {matches.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
                            <h3 className="text-2xl font-black text-zinc-300 uppercase italic">No Matches Found</h3>
                        </div>
                    ) : (
                        matches.map(m => (
                            <Link key={m.id} href={`/match/${m.id}`}>
                                <Card variant="outline" className="p-8 group relative border-zinc-200 hover:border-red-600/40 transition-all duration-500 overflow-hidden bg-white shadow-sm hover:shadow-xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 grayscale">
                                        <Trophy className="w-32 h-32 rotate-12" />
                                    </div>

                                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                        {/* Meta */}
                                        <div className="lg:col-span-3 flex flex-col gap-2">
                                            <span className="text-[9px] font-black text-red-600/60 uppercase tracking-[0.3em]">{m.sport}</span>
                                            <span className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 truncate">{m.tournament.name}</span>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${m.status === 'live' ? 'bg-red-600 border-red-600 text-white animate-pulse' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
                                                    {m.status}
                                                </div>
                                                <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(m.startTime).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Teams */}
                                        <div className="lg:col-span-6 flex flex-col gap-4">
                                            {m.teams?.map((t, idx) => {
                                                const liveData = JSON.parse(m.liveData);
                                                const score = liveData.scoreSummary?.[`t${idx}`] || 0;
                                                return (
                                                    <div key={t.id} className="flex justify-between items-center bg-zinc-50/50 p-4 rounded-xl border border-zinc-100 group-hover:border-zinc-200 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white rounded-xl border border-zinc-200 flex items-center justify-center font-black text-lg text-zinc-900 shadow-sm">
                                                                {t.team.name[0]}
                                                            </div>
                                                            <span className="text-xl font-black uppercase tracking-tight text-zinc-900">
                                                                {t.team.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-3xl font-black text-zinc-900">{score}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Action */}
                                        <div className="lg:col-span-3 flex justify-end">
                                            <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:text-white transition-all duration-300">
                                                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
