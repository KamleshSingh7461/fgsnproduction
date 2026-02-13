'use client';

import React, { useState } from 'react';
import { createTeamAndEnlist } from '@/lib/actions';
import { Plus, X, Globe } from 'lucide-react';
import { Button } from '@fgsn/ui';

export function TeamCreationModal({ tournamentId, onCreated }: { tournamentId: string, onCreated: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const shortName = formData.get('shortName') as string;

        try {
            await createTeamAndEnlist(tournamentId, name, shortName);
            onCreated();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to create team", error);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-600 hover:text-black transition-all flex items-center gap-2"
            >
                <Plus className="w-3 h-3" /> Register New Team
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Register New Force</h3>
                            <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest mt-1">Direct Field Enlistment</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-emerald-500/50 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Force Designation (Team Name)</label>
                            <input
                                name="name"
                                required
                                className="w-full bg-black/40 border border-emerald-500/10 rounded-xl px-4 py-3 text-sm font-bold text-emerald-300 outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900"
                                placeholder="e.g. Thunder Bay Titans"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Short Code (3-4 Chars)</label>
                            <input
                                name="shortName"
                                maxLength={4}
                                className="w-full bg-black/40 border border-emerald-500/10 rounded-xl px-4 py-3 text-sm font-bold text-emerald-300 outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900 uppercase"
                                placeholder="TBT"
                            />
                        </div>

                        <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 flex gap-4 items-center">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Globe className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-[9px] font-bold text-emerald-700 leading-relaxed uppercase">
                                This team will be added to the global reserve and automatically enlisted in your current zone.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full !rounded-xl py-4 !bg-emerald-600 !text-black font-black uppercase tracking-widest text-xs mt-4"
                        >
                            {loading ? 'ENLISTING...' : 'ENLIST FORCE'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
