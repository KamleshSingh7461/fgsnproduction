import { getTournaments, createTournament, deleteTournament, getUsers, assignManagerToTournament, removeManagerFromTournament } from '@/lib/actions';
import { Card, Button } from '@fgsn/ui';
import { Trophy, Plus, Trash2, Calendar, UserPlus, ShieldCheck, Mail } from 'lucide-react';
import { ManagerAccountModal } from '@/components/ManagerAccountModal';

export default async function TournamentsPage() {
    const tournaments = await getTournaments();
    const users = await getUsers();
    const managers = users.filter(u => u.role === 'EVENT_MANAGER' || u.role === 'ADMIN');

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                        Tournaments <span className="text-indigo-500">Management</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">
                        Create and manage global sports leagues
                    </p>
                </div>

                <form action={createTournament} className="flex gap-4">
                    <input
                        name="name"
                        placeholder="League Name..."
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-indigo-500 transition-all w-64 text-white"
                        required
                    />
                    <input
                        name="location"
                        placeholder="Location/Site..."
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-indigo-500 transition-all w-48 text-white"
                    />
                    <select name="category" className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none text-white">
                        <option value="International">International</option>
                        <option value="Domestic">Domestic</option>
                        <option value="Club">Club</option>
                    </select>
                    <select name="sport" className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none text-white">
                        <option value="cricket">Cricket</option>
                        <option value="basketball">Basketball</option>
                        <option value="football">Football</option>
                        <option value="volleyball">Volleyball</option>
                    </select>
                    <Button variant="primary" className="!rounded-xl px-6 font-black">
                        <Plus className="w-4 h-4 mr-2" /> CREATE
                    </Button>
                </form>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Trophy className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No tournaments found. Create your first league above.</p>
                    </div>
                )}

                {tournaments.map((t) => (
                    <Card key={t.id} variant="glass" className="p-6 relative group overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Trophy className="w-24 h-24 text-white" />
                        </div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-2">
                                <div className="bg-indigo-600/20 px-3 py-1 rounded-full border border-indigo-500/30">
                                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{t.category}</span>
                                </div>
                                {t.location && (
                                    <div className="bg-zinc-800 px-3 py-1 rounded-full border border-white/5">
                                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">@{t.location}</span>
                                    </div>
                                )}
                            </div>

                            <form action={async () => {
                                'use server';
                                await deleteTournament(t.id);
                            }}>
                                <button className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        <h3 className="text-xl font-black text-white mb-2 truncate uppercase">{t.name}</h3>
                        <div className="flex items-center gap-2 text-zinc-500 mb-6">
                            <Calendar className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">Created {new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Manager Assignment */}
                        <div className="mt-auto space-y-4">
                            <div className="pt-4 border-t border-white/5">
                                <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-indigo-400" /> Assigned Managers
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(t as any).managers.length === 0 ? (
                                        <span className="text-[9px] text-zinc-600 font-bold uppercase">Unassigned</span>
                                    ) : (
                                        (t as any).managers.map((m: any) => (
                                            <div key={m.id} className="text-[9px] bg-white/5 px-2 py-1 rounded-lg border border-white/5 font-bold text-zinc-400 flex items-center gap-2 group/manager">
                                                {m.user.name}
                                                <form action={async () => {
                                                    'use server';
                                                    await removeManagerFromTournament(t.id, m.user.id);
                                                }}>
                                                    <button className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover/manager:opacity-100">
                                                        <Trash2 className="w-2.5 h-2.5" />
                                                    </button>
                                                </form>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <form action={async (formData) => {
                                    'use server';
                                    const userId = formData.get('userId') as string;
                                    if (userId) await assignManagerToTournament(t.id, userId);
                                }} className="flex gap-2">
                                    <select name="userId" className="flex-1 bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-bold text-zinc-400 outline-none focus:border-indigo-500 transition-all">
                                        <option value="">Assign Existing Manager...</option>
                                        {managers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                                    </select>
                                    <button type="submit" className="p-1.5 bg-indigo-600/10 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all">
                                        <UserPlus className="w-3 h-3" />
                                    </button>
                                </form>

                                <div className="mt-4 flex items-center gap-2">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <span className="text-[8px] font-black text-zinc-700 uppercase">OR</span>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>

                                <ManagerAccountModal tournamentId={t.id} tournamentName={t.name} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
