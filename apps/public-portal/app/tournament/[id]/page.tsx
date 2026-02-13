
import { Card } from '@fgsn/ui';
import { getTournamentDetails } from '@/lib/actions';
import { Calendar, MapPin, Users, Activity, Trophy } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';

export default async function TournamentDetailsPage({ params }: { params: { id: string } }) {
    const tournament = await getTournamentDetails(params.id);

    if (!tournament) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01] grayscale" />
            </div>

            {/* Navbar */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Header */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-zinc-900 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 shadow-xl">
                        <Trophy className="w-3 h-3 text-red-500" />
                        {tournament.category}
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 mb-6">
                        {tournament.name}
                    </h1>
                    <div className="flex flex-wrap gap-8 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-900" /> {tournament.location || 'Global'}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-zinc-900" /> Season {new Date(tournament.createdAt).getFullYear()}</span>
                        <span className="flex items-center gap-2"><Users className="w-4 h-4 text-zinc-900" /> {tournament.teams.length} Teams Enlisted</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Schedule / Matches */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 mb-8 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-red-600" /> Match Schedule
                        </h3>

                        <div className="flex flex-col gap-4">
                            {tournament.matches.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-zinc-200 rounded-2xl text-center">
                                    <span className="text-zinc-300 font-bold uppercase tracking-widest text-xs">No Scheduled Matches</span>
                                </div>
                            ) : (
                                tournament.matches.map(m => (
                                    <Link key={m.id} href={`/match/${m.id}`}>
                                        <Card className="p-6 hover:border-red-600/30 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${m.status === 'live' ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-100 text-zinc-500'}`}>
                                                            {m.status}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                                            {new Date(m.startTime).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xl font-black uppercase tracking-tight text-zinc-900">
                                                        <span>{m.teams[0]?.team.name || 'TBD'}</span>
                                                        <span className="text-zinc-300 text-sm">VS</span>
                                                        <span>{m.teams[1]?.team.name || 'TBD'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-black text-zinc-900/10 group-hover:text-red-600/10 transition-colors">
                                                    VS
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Standings / Teams */}
                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 mb-8 flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-600" /> Teams
                        </h3>
                        <div className="flex flex-col gap-2">
                            {tournament.teams.map((t, idx) => (
                                <div key={t.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <span className="text-lg font-black text-zinc-300 w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                                    <div className="w-10 h-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center font-bold text-zinc-900 uppercase">
                                        {t.team.name.substring(0, 2)}
                                    </div>
                                    <span className="font-bold text-zinc-900 text-sm uppercase tracking-wide">{t.team.name}</span>
                                </div>
                            ))}
                            {tournament.teams.length === 0 && (
                                <div className="p-8 border border-dashed border-zinc-200 rounded-xl text-center">
                                    <span className="text-zinc-300 font-bold uppercase tracking-widest text-xs">Registration Open</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
