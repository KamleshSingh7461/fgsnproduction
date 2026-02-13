'use client';

import { useState } from 'react';
import { createManagerAccount } from '@/lib/actions';
import { UserPlus, Copy, Check, X, Shield, Lock, Mail } from 'lucide-react';
import { Button } from '@fgsn/ui';

export function ManagerAccountModal({ tournamentId, tournamentName }: { tournamentId: string, tournamentName: string }) {
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
            const result = await createManagerAccount(tournamentId, name, email);
            setCredentials(result);
        } catch (error) {
            console.error("Failed to create manager", error);
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = () => {
        const text = `FGSN Manager Credentials\n\nName: ${credentials.name}\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nLogin at http://localhost:3000`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 p-2 bg-indigo-600/5 hover:bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest transition-all"
            >
                <UserPlus className="w-3 h-3" /> Create New Manager
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {!credentials ? (
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">New Manager Account</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Assign to {tournamentName}</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1.5 focus:outline-none ml-1">Personnel Name</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all"
                                    placeholder="Enter full name..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-1.5 focus:outline-none ml-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all"
                                    placeholder="manager@fgsn.com"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="w-full !rounded-xl py-4 font-black uppercase tracking-widest text-xs mt-4"
                            >
                                {loading ? 'PROVISIONING...' : 'PROVISION ACCOUNT'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                            <Shield className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Account Provisioned</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">Share these credentials with the manager</p>

                        <div className="space-y-3 mb-8 text-left">
                            <CredentialRow icon={<Mail className="w-3 h-3" />} label="Email" value={credentials.email} />
                            <CredentialRow icon={<Lock className="w-3 h-3" />} label="Password" value={credentials.password} />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={copyToClipboard}
                                className="flex-1 !rounded-xl py-3 !bg-white !text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'COPIED' : 'COPY ALL'}
                            </Button>
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 !rounded-xl py-3 !bg-zinc-800 !text-white font-black uppercase tracking-widest text-[10px]"
                            >
                                CLOSE
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
        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-[8px] font-black text-zinc-600 uppercase mb-1">
                {icon} {label}
            </div>
            <div className="text-sm font-mono font-bold text-indigo-400 select-all break-all">{value}</div>
        </div>
    );
}
