import Link from 'next/link';
import { ShieldCheck, Activity } from 'lucide-react';

export function Footer() {
    return (
        <footer className="py-20 px-6 border-t border-zinc-100 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-start gap-6 max-w-xs">
                    <img src="/FGSN-logo.png" alt="FGSN" className="h-16 w-auto invert hue-rotate-180" />
                    <p className="text-xs font-bold leading-relaxed text-zinc-400 uppercase tracking-widest">
                        Freedom Global Sports Network Private Limited.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex flex-col gap-4">
                        <span className="text-zinc-900">Solutions</span>
                        <Link href="/services" className="text-zinc-400 hover:text-zinc-900">Broadcasting</Link>
                        <Link href="/services" className="text-zinc-400 hover:text-zinc-900">Operations</Link>
                        <Link href="/services" className="text-zinc-400 hover:text-zinc-900">Analytics</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-zinc-900">Company</span>
                        <Link href="/about" className="text-zinc-400 hover:text-zinc-900">The Vision</Link>
                        <Link href="/tournaments" className="text-zinc-400 hover:text-zinc-900">Partners</Link>
                        <Link href="/about" className="text-zinc-400 hover:text-zinc-900">Careers</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-zinc-900">Legal</span>
                        <Link href="/about" className="text-zinc-400 hover:text-zinc-900">Terms</Link>
                        <Link href="/about" className="text-zinc-400 hover:text-zinc-900">Privacy</Link>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-100 flex justify-between items-center text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                <span>&copy; 2026 Freedom Global Sports Network Private Limited.</span>
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Secure Sync</span>
                    <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> 99.9% Uptime</span>
                </div>
            </div>
        </footer>
    );
}
