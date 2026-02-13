
import { Card } from '@fgsn/ui';
import { Target, Globe, Shield, Zap, Mail, ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-zinc-50 via-white to-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.3]" />
            </div>

            {/* Navbar */}
            <Navbar />

            <main className="relative z-10">
                <header className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-gradient-to-r from-zinc-900 to-zinc-800 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-zinc-700/50">
                        <Target className="w-3 h-3 text-red-500" />
                        The Vision
                    </div>
                    <h1 className="text-5xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] mb-8">
                        <span className="text-zinc-900">Redefining</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
                            The Game
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-bold uppercase tracking-tight leading-relaxed">
                        Freedom Global Sports Network (FGSN) is the technological backbone for the next generation of sports entertainment.
                    </p>
                </header>

                {/* Mission Grid */}
                <section className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Global Reach Card */}
                        <Card className="group relative p-10 bg-red-50 border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent transition-all duration-300" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-transform duration-300">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 mb-4">Global Reach</h3>
                                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                                    Creating a unified platform where local leagues can achieve global visibility through our centralized broadcast infrastructure.
                                </p>
                            </div>
                        </Card>

                        {/* Zero Latency Card */}
                        <Card className="group relative p-10 bg-blue-50 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-300" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 mb-4">Zero Latency</h3>
                                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                                    Our proprietary real-time engine ensures that data travels from the field to the fan in under 100 milliseconds.
                                </p>
                            </div>
                        </Card>

                        {/* Integrity First Card */}
                        <Card className="group relative p-10 bg-emerald-50 border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-300" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 mb-4">Integrity First</h3>
                                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                                    Built-in audit trails and role-based access control guarantee the accuracy and fairness of every scored point.
                                </p>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Team Section */}
                <section className="bg-zinc-900 py-32 px-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-900" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
                            <div>
                                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">
                                    Our Team
                                </div>
                                <h2 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">The Squad</h2>
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Architects of the new digital arena.</p>
                            </div>
                            <Link href="/careers">
                                <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-black uppercase tracking-widest text-xs hover:from-red-500 hover:to-red-600 transition-all duration-300 flex items-center gap-3 rounded-xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_10px_40px_rgba(220,38,38,0.4)] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/0 transition-all duration-300" />
                                    <span className="relative z-10">Join the Team</span>
                                    <UserPlus className="w-4 h-4 relative z-10" />
                                </button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {/* Sunny Bhandarkar */}
                            <div className="group relative bg-zinc-800/50 backdrop-blur-sm p-8 rounded-3xl hover:bg-zinc-800 transition-all duration-300 cursor-pointer border border-zinc-700/50 hover:border-zinc-600 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-transparent transition-all duration-300" />
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-zinc-700 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden ring-2 ring-zinc-600 group-hover:ring-red-500/50">
                                        <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="Sunny Bhandarkar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                    </div>
                                    <h4 className="font-black uppercase tracking-tight text-xl mb-1">Sunny Bhandarkar</h4>
                                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Director</span>
                                </div>
                            </div>

                            {/* Pranav Prabhu */}
                            <div className="group relative bg-zinc-800/50 backdrop-blur-sm p-8 rounded-3xl hover:bg-zinc-800 transition-all duration-300 cursor-pointer border border-zinc-700/50 hover:border-zinc-600 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-transparent transition-all duration-300" />
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-zinc-700 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden ring-2 ring-zinc-600 group-hover:ring-red-500/50">
                                        <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="Pranav Prabhu" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                    </div>
                                    <h4 className="font-black uppercase tracking-tight text-xl mb-1">Pranav Prabhu</h4>
                                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Director</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="py-32 px-6 bg-white">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative p-12 md:p-16 rounded-[40px] border border-zinc-200 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] text-center overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                                    <Mail className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 text-zinc-900">Get in Touch</h2>
                                <p className="text-lg text-zinc-500 mb-10 font-medium">
                                    For partnership inquiries, technical support, or press relations.
                                </p>
                                <a
                                    href="mailto:contact@fgsnlive.com"
                                    className="group inline-flex items-center gap-3 text-2xl font-black text-zinc-900 hover:text-red-600 transition-colors pb-2 border-b-4 border-zinc-900 hover:border-red-600"
                                >
                                    contact@fgsnlive.com
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
