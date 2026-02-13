'use client';

import { useState } from 'react';
import { createScorerAndAssign } from '@/lib/actions';
import { Zap, Copy, Check, X, Shield, Lock, Mail } from 'lucide-react';
import { Button } from '@fgsn/ui';

export function ScorerProvisionModal({ matchId, role, onAssigned }: { matchId: string, role: string, onAssigned: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        try {
            const result = await createScorerAndAssign(matchId, name, email, role);
            setCredentials(result);
        } catch (error) {
            console.error("Failed to provision scorer", error);
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = () => {
        const text = `FGSN Scorer Credentials\n\nRole: ${role}\nName: ${credentials.name}\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nLogin at http://localhost:3000`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-emerald-600/5 hover:bg-emerald-600/10 border border-emerald-500/20 px-2 py-1.5 rounded text-[8px] font-black text-emerald-400 uppercase tracking-widest transition-all mt-1"
            >
                + Provision New Unit
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {!credentials ? (
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Provision Scorer Unit</h3>
                                <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest mt-1">Role: {role.replace('_', ' ')}</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-emerald-500/50 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Personnel Name</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full bg-black/40 border border-emerald-500/10 rounded-xl px-4 py-3 text-sm font-bold text-emerald-300 outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900"
                                    placeholder="Enter full name..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-black/40 border border-emerald-500/10 rounded-xl px-4 py-3 text-sm font-bold text-emerald-300 outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-900"
                                    placeholder="scorer@fgsn.com"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full !rounded-xl py-4 !bg-emerald-600 !text-black font-black uppercase tracking-widest text-xs mt-4"
                            >
                                {loading ? 'DEPLOYING UNIT...' : 'DEPLOY SCORER'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <Zap className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Unit Deployed</h3>
                        <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest mb-8">Role: {role.replace('_', ' ')} | Credentials below</p>

                        <div className="space-y-3 mb-8 text-left">
                            <CredentialRow icon={<Mail className="w-3 h-3 text-emerald-500" />} label="Email" value={credentials.email} />
                            <CredentialRow icon={<Lock className="w-3 h-3 text-emerald-500" />} label="Password" value={credentials.password} />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={copyToClipboard}
                                className="flex-1 !rounded-xl py-3 !bg-emerald-500 !text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'COPIED' : 'COPY ALL'}
                            </Button>
                            <Button
                                onClick={() => { onAssigned(); setIsOpen(false); }}
                                className="flex-1 !rounded-xl py-3 !bg-zinc-800 !text-white font-black uppercase tracking-widest text-[10px] border border-emerald-500/20"
                            >
                                RETURN TO HUD
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CredentialRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-black/60 border border-emerald-500/10 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-[8px] font-black text-emerald-800 uppercase mb-1">
                {icon} {label}
            </div>
            <div className="text-sm font-mono font-bold text-emerald-400 select-all break-all">{value}</div>
        </div>
    );
}
