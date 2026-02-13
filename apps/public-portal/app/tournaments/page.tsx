
import { Card } from '@fgsn/ui';
import { Trophy, Calendar, MapPin, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { getTournaments } from '@/lib/actions';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default async function TournamentsPage() {
    const tournaments = await getTournaments();

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01] grayscale" />
            </div>

            {/* Navbar */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <header className="mb-20">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-zinc-900 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 shadow-xl">
                        <Trophy className="w-3 h-3 text-red-500" />
                        Official Circuits
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 mb-6">
                        Active <br /> Tournaments
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl font-bold uppercase tracking-tight">
                        The world's premier competitive leagues and knockout stages.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.length === 0 ? (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
                            <h3 className="text-2xl font-black text-zinc-300 uppercase italic">No Active Circuits</h3>
                        </div>
                    ) : (
                        tournaments.map(t => (
                            <Link key={t.id} href={`/tournament/${t.id}`}>
                                <Card className="group h-full flex flex-col justify-between p-8 border-zinc-200 hover:border-red-600/40 transition-all duration-500 overflow-hidden bg-white shadow-sm hover:shadow-2xl relative">
                                    <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 grayscale rotate-12">
                                        <Trophy className="w-64 h-64" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-start mb-8">
                                            <span className="px-3 py-1 bg-zinc-100 text-[9px] font-black uppercase tracking-widest text-zinc-500 rounded-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                {t.category}
                                            </span>
                                            <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                                        </div>

                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 mb-2 leading-none">
                                            {t.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-8">
                                            <MapPin className="w-3 h-3" /> {t.location || 'Global/Online'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                                <Users className="w-4 h-4 text-zinc-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-zinc-900">{t.teams?.length || 0}</span>
                                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Teams</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                                <Calendar className="w-4 h-4 text-zinc-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-zinc-900">{new Date(t.createdAt).getFullYear()}</span>
                                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Season</span>
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
