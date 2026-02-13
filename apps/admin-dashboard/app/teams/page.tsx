import { getTeams, createTeam, deleteTeam } from '@/lib/actions';
import { Card, Button } from '@fgsn/ui';
import { Users, Plus, Trash2, Shield } from 'lucide-react';

export default async function TeamsPage() {
    const teams = await getTeams();

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                        Teams <span className="text-indigo-500">Directory</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">
                        Manage roster and group configurations
                    </p>
                </div>

                <form action={createTeam} className="flex gap-4">
                    <input
                        name="name"
                        placeholder="Team Full Name..."
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-indigo-500 transition-all w-64"
                        required
                    />
                    <input
                        name="shortName"
                        placeholder="Short Code (e.g. MI)"
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-indigo-500 transition-all w-32"
                    />
                    <Button variant="primary" className="!rounded-xl px-6 font-black">
                        <Plus className="w-4 h-4 mr-2" /> CREATE
                    </Button>
                </form>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teams.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Shield className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No teams found. Register your first team above.</p>
                    </div>
                )}

                {teams.map((team) => (
                    <Card key={team.id} variant="glass" className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <span className="font-black text-indigo-500 text-lg">{team.shortName || team.name.substring(0, 2).toUpperCase()}</span>
                            </div>

                            <form action={async () => {
                                'use server';
                                await deleteTeam(team.id);
                            }}>
                                <button className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        <h3 className="text-lg font-black text-white mb-1 truncate uppercase">{team.name}</h3>
                        <div className="flex items-center gap-2 text-zinc-500 mb-6">
                            <Users className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase">{team.players.length} Registered Players</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex -space-x-2">
                                {team.players.slice(0, 5).map((p, i) => (
                                    <div key={p.id} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-black text-zinc-400">
                                        {p.name.charAt(0)}
                                    </div>
                                ))}
                                {team.players.length > 5 && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-black text-white">
                                        +{team.players.length - 5}
                                    </div>
                                )}
                            </div>

                            <Button variant="secondary" className="w-full text-[10px] font-black uppercase tracking-widest !py-2">
                                Manage Roster
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
