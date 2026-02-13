import { getPlayers, createPlayer, getTeams } from '@/lib/actions';
import { Card, Button } from '@fgsn/ui';
import { User, Plus, UserPlus, Shield } from 'lucide-react';

export default async function PlayersPage() {
    const players = await getPlayers();
    const teams = await getTeams();

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                        Athletes <span className="text-indigo-500">Registry</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">
                        Global player database and team assignments
                    </p>
                </div>

                <form action={createPlayer} className="flex gap-4">
                    <input
                        name="name"
                        placeholder="Player Full Name..."
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-indigo-500 transition-all w-64"
                        required
                    />
                    <select name="teamId" className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 font-bold text-sm outline-none w-48" required>
                        <option value="">Select Team...</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <Button variant="primary" className="!rounded-xl px-6 font-black">
                        <UserPlus className="w-4 h-4 mr-2" /> REGISTER
                    </Button>
                </form>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {players.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <User className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No athletes registered. Add your first player above.</p>
                    </div>
                )}

                {players.map((player) => (
                    <Card key={player.id} variant="glass" className="p-5 flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {player.name.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-black text-white uppercase truncate">{player.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Shield className="w-3 h-3 text-zinc-600" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase truncate">{player.team.name}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
