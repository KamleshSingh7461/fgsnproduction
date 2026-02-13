'use client';

import { useEffect, useState } from 'react';
import { Layout, Trophy, Users, UserCog, Database, LogOut, Shield, Zap } from 'lucide-react';

interface UserSession {
    userId: string;
    role: string;
    name: string;
}

export default function Sidebar() {
    const [user, setUser] = useState<UserSession | null>(null);

    useEffect(() => {
        // Parse token from URL if present (simplified for demo)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            try {
                const decoded = JSON.parse(atob(token));
                setUser(decoded);
                localStorage.setItem('fgsn_session', token);
            } catch (e) {
                console.error('Failed to decode token');
            }
        } else {
            const savedToken = localStorage.getItem('fgsn_session');
            if (savedToken) {
                try {
                    const decoded = JSON.parse(atob(savedToken));
                    setUser(decoded);
                } catch (e) { }
            }
        }
    }, []);

    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    return (
        <aside className="w-64 border-r border-white/5 bg-zinc-900/50 backdrop-blur-xl flex flex-col p-6 sticky top-0 h-screen">
            <div className="flex items-center gap-3 mb-10">
                <img
                    src="/FGSN-logo.png"
                    alt="FGSN Logo"
                    className="h-10 w-auto"
                />
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem href="/" icon={<Layout className="w-4 h-4" />} label="Dashboard" active />

                {(user?.role === 'EVENT_MANAGER' || isAdmin) && (
                    <NavItem href="http://localhost:3006" icon={<Shield className="w-4 h-4 text-emerald-500" />} label="Tactical Command" external />
                )}

                {(user?.role === 'SCORER' || isAdmin) && (
                    <NavItem href="http://localhost:3007" icon={<Zap className="w-4 h-4 text-yellow-500" />} label="Scoring Ops" external />
                )}

                {isAdmin && (
                    <>
                        <div className="pt-4 pb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Governance</div>
                        <NavItem href="/tournaments" icon={<Trophy className="w-4 h-4" />} label="Tournaments" />
                        <NavItem href="/teams" icon={<Users className="w-4 h-4" />} label="Teams" />
                        <NavItem href="/players" icon={<Database className="w-4 h-4" />} label="Players" />
                        <NavItem href="/users" icon={<UserCog className="w-4 h-4" />} label="Personnel Management" />
                    </>
                )}

                {isSuperAdmin && (
                    <>
                        <div className="pt-4 pb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Security</div>
                        <NavItem href="/users" icon={<UserCog className="w-4 h-4" />} label="System Access" />
                    </>
                )}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white truncate">{user?.name || 'Loading...'}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-black">{user?.role?.replace('_', ' ') || 'Authenticating'}</div>
                        </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('fgsn_session'); window.location.href = 'http://localhost:3000'; }} className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, active = false, external = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean; external?: boolean }) {
    const Component = external ? 'a' : 'a'; // Both are anchor tags for now, but external could be used for target="_blank"
    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                }`}
        >
            {icon}
            <span>{label}</span>
        </a>
    );
}
