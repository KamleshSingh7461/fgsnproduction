'use client';

import { Card, Button } from '@fgsn/ui';
import { UserSessionDTO } from '@fgsn/dtos';
import { useState } from 'react';
import { Lock } from 'lucide-react';

import { login } from '../lib/actions';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('superadmin@fgsn.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await login(email, password);

            // Redirect based on role
            if (result.role === 'SUPER_ADMIN' || result.role === 'ADMIN') {
                window.location.href = `http://localhost:3001?token=${result.token}`; // Admin Hub
            } else if (result.role === 'EVENT_MANAGER') {
                window.location.href = `http://localhost:3006?token=${result.token}`; // Tactical Manager Hub
            } else if (result.role === 'SCORER') {
                window.location.href = `http://localhost:3007?token=${result.token}`; // Scoring Portal
            }
        } catch (e: any) {
            setError(e.message || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-md p-4">
                <div className="text-center mb-8">
                    <img
                        src="/FGSN-logo.png"
                        alt="FGSN Logo"
                        className="h-24 mx-auto drop-shadow-2xl"
                    />
                    <p className="text-gray-400 mt-4 italic uppercase text-[10px] tracking-[0.3em]">Authorized Access Only</p>
                </div>

                <Card variant="glass" className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-red-500 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                            />
                        </div>
                    </div>

                    <Button onClick={handleLogin} isLoading={isLoading} className="w-full py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                        Authenticate
                    </Button>

                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[9px] text-gray-600 font-bold uppercase text-center mb-2">Demo Access</p>
                        <div className="flex gap-2 justify-center">
                            <button onClick={() => { setEmail('superadmin@fgsn.com'); setPassword('password123'); }} className="text-[8px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-gray-400 transition-colors font-black">GLOBAL ADMIN</button>
                            <button onClick={() => { setEmail('admin@fgsn.com'); setPassword('password123'); }} className="text-[8px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-gray-400 transition-colors font-black">ADMIN OFFICER</button>
                            <button onClick={() => { setEmail('manager@fgsn.com'); setPassword('password123'); }} className="text-[8px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-gray-400 transition-colors font-black">TACTICAL MANAGER</button>
                            <button onClick={() => { setEmail('scorer@fgsn.com'); setPassword('password123'); }} className="text-[8px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-gray-400 transition-colors font-black">FIELD SCORER</button>
                        </div>
                    </div>
                </Card>

                <p className="text-center text-xs text-gray-600 mt-8">
                    &copy; 2024 Freedom Global Sports Network. All rights reserved. <br />
                    Microservice Architecture v2.0
                </p>
            </div>
        </div>
    );
}
