'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button } from '@fgsn/ui';
import { getUsers, createUser } from '@/lib/actions';
import { UserCog, UserPlus, Copy, Check, Shield, Lock, Mail } from 'lucide-react';
import { UserList } from '@/components/UserList';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [userSession, setUserSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [credentials, setCredentials] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('fgsn_session');
        if (session) {
            setUserSession(JSON.parse(atob(session)));
        }
        loadUsers();
    }, []);

    async function loadUsers() {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    }

    const copyToClipboard = () => {
        const text = `FGSN Personnel Credentials\n\nName: ${credentials.name}\nRole: ${credentials.role}\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nLogin at http://localhost:3000`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-indigo-500 font-mono tracking-widest uppercase">Syncing Personnel Database...</div>;

    const isAdmin = userSession?.role === 'ADMIN';
    const isSuperAdmin = userSession?.role === 'SUPER_ADMIN';

    return (
        <div className="min-h-screen p-8 bg-zinc-950 text-white animate-fade-in">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">
                        Personnel <span className="text-indigo-500">Inventory</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">
                        {isSuperAdmin ? 'Global Authority Control' : 'Strategic Resource Management'}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* User List */}
                <div className="xl:col-span-2 space-y-4">
                    <Card variant="solid" className="p-6 bg-zinc-900/50">
                        <div className="flex items-center gap-3 mb-8">
                            <UserCog className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Deployment Roster</h2>
                        </div>

                        <div className="space-y-3">
                            <UserList users={users} />
                        </div>
                    </Card>
                </div>

                {/* Onboard Personnel */}
                <div className="xl:col-span-1">
                    <Card variant="glass" className="p-6 h-fit sticky top-8">
                        {!credentials ? (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <UserPlus className="w-5 h-5 text-indigo-400" />
                                    <h2 className="text-xl font-black uppercase tracking-tight">Onboard Personnel</h2>
                                </div>

                                <form action={async (formData) => {
                                    setError(null);
                                    const role = formData.get('role') as string;
                                    const name = formData.get('name') as string;
                                    const email = formData.get('email') as string;
                                    const password = formData.get('password') as string;

                                    try {
                                        await createUser(formData);
                                        setCredentials({ name, role, email, password });
                                        loadUsers();
                                    } catch (e: any) {
                                        setError(e.message || "Failed to authorize personnel. Email might already be in use.");
                                    }
                                }} className="space-y-4">
                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-[10px] font-bold text-center animate-shake">
                                            {error}
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-500 uppercase mb-1 block">Full Name</label>
                                        <input name="name" required type="text" className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold" placeholder="e.g. Cmdr. Jackson" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-500 uppercase mb-1 block">Email Address</label>
                                        <input name="email" required type="email" className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-500 uppercase mb-1 block">Initial Password</label>
                                        <input name="password" required type="password" className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-500 uppercase mb-1 block">Assigned Authority Role</label>
                                        <select name="role" className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold appearance-none uppercase">
                                            {isSuperAdmin && <option value="ADMIN">ADMIN OFFICER</option>}
                                            <option value="EVENT_MANAGER">TACTICAL MANAGER</option>
                                            <option value="SCORER">FIELD SCORER</option>
                                        </select>
                                    </div>
                                    <Button type="submit" className="w-full py-4 font-black uppercase tracking-widest text-[10px] mt-2">
                                        Authorize Personnel
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <Shield className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Personnel Authorized</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">Mission uplink credentials ready</p>

                                <div className="space-y-2 mb-6 text-left">
                                    <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 text-[7px] font-black text-zinc-600 uppercase mb-1">
                                            <Mail className="w-2.5 h-2.5" /> Email
                                        </div>
                                        <div className="text-xs font-mono font-bold text-indigo-400 break-all">{credentials.email}</div>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 text-[7px] font-black text-zinc-600 uppercase mb-1">
                                            <Lock className="w-2.5 h-2.5" /> Password
                                        </div>
                                        <div className="text-xs font-mono font-bold text-indigo-400">{credentials.password}</div>
                                    </div>
                                    <div className="bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-xl text-center">
                                        <div className="text-[7px] font-black text-indigo-400 uppercase mb-1">Mission Uplink</div>
                                        <div className="text-[9px] font-bold text-zinc-400">http://localhost:3000</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button onClick={copyToClipboard} className="w-full !rounded-xl py-3 !bg-white !text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'COPIED TO CLIPBOARD' : 'COPY CREDENTIALS'}
                                    </Button>
                                    <Button onClick={() => setCredentials(null)} className="w-full !rounded-xl py-3 !bg-zinc-800 !text-white font-black uppercase tracking-widest text-[10px]">
                                        ONBOARD ANOTHER
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
