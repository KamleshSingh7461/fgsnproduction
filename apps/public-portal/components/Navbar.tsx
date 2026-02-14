'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const links = [
        { href: '/matches', label: 'Live Scores' },
        { href: '/tournaments', label: 'Tournaments' },
        { href: '/services', label: 'Our Services' },
        { href: '/partners', label: 'Partners' },
        { href: '/about', label: 'About Us' },
        { href: '/reach-us', label: 'Reach Us' },
    ];

    return (
        <nav className="border-b border-zinc-100 p-4 md:p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50 bg-white/80">
            <div className="flex items-center gap-4 relative z-50">
                <Link href="/" onClick={() => setIsOpen(false)}>
                    <img
                        src="/FGSN-logo.png"
                        alt="FGSN Logo"
                        className="h-8 md:h-10 w-auto hover:scale-110 transition-transform cursor-pointer invert hue-rotate-180"
                    />
                </Link>
                <div className="h-4 w-px bg-zinc-200 hidden md:block" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hidden md:block">
                    Freedom Global Sports Network
                </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-10 text-[11px] font-black text-zinc-400 tracking-widest uppercase">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`transition-all hover:tracking-[0.3em] ${pathname === link.href ? 'text-red-600' : 'hover:text-zinc-900'}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-3 md:gap-6 relative z-[70]">
                <div className="flex items-center gap-2 group cursor-pointer hidden md:flex">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                        LIVE NETWORK
                    </span>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden relative p-3 text-white bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl hover:from-red-600 hover:via-red-700 hover:to-red-600 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.4)] border border-zinc-700/50 hover:border-red-500/50 group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:to-red-500/0 transition-all duration-300" />

                    {isOpen ? <X className="w-5 h-5 relative z-10" /> : <Menu className="w-5 h-5 relative z-10" />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-zinc-900 z-[60] flex flex-col lg:hidden w-screen h-screen overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col h-full px-8 py-20">
                        {/* Header */}
                        <div className="mb-16">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">
                                Navigation
                            </div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                                Explore <br />The Network
                            </h2>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 flex flex-col gap-1">
                            {links.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="group relative"
                                    style={{
                                        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <div className={`flex items-center gap-6 py-4 px-6 rounded-2xl transition-all duration-300 ${pathname === link.href
                                        ? 'bg-red-600 text-white'
                                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                                        }`}>
                                        {/* Number */}
                                        <span className="text-xs font-black opacity-40 w-8">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        {/* Separator */}
                                        <div className="h-8 w-px bg-white/10" />

                                        {/* Label */}
                                        <span className="text-xl font-black uppercase tracking-tight flex-1">
                                            {link.label}
                                        </span>

                                        {/* Arrow */}
                                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${pathname === link.href
                                            ? 'bg-white scale-100'
                                            : 'bg-white/20 scale-0 group-hover:scale-100'
                                            }`} />
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        {/* Footer */}
                        <div className="mt-auto pt-8 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                                        LIVE NETWORK
                                    </span>
                                </div>
                                <span className="text-xs font-black text-white/40 uppercase tracking-widest">
                                    FGSN v2.0
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
