'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Shield, Zap, Mail, ArrowRight, Star, Cpu, Network, Layers } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10 selection:text-red-600">
            {/* Cinematic Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-zinc-50 via-white to-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:60px_60px] opacity-[0.4]" />

                {/* Floating Abstract Shapes */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"
                />
            </div>

            <Navbar />

            <main className="relative z-10">
                {/* Modern Cinematic Hero */}
                <header className="max-w-7xl mx-auto px-6 pt-40 pb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-zinc-900 text-[10px] font-black uppercase tracking-[0.4em] text-white/90 mb-10 shadow-2xl border border-zinc-700/50 backdrop-blur-md"
                    >
                        <Network className="w-3.5 h-3.5 text-red-500" />
                        Strategic Ecosystem
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-12"
                    >
                        <span className="text-zinc-900 block">World Class</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 drop-shadow-sm">
                            Partnerships
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-bold uppercase tracking-tight leading-relaxed italic"
                    >
                        We don't just work together. We redefine the technological <br className="hidden md:block" />
                        boundaries of global sports broadcasting.
                    </motion.p>
                </header>

                {/* Premium Value Blocks - Replacing basic cards */}
                <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {[
                        {
                            title: "Global Distribution",
                            description: "Strategic partnerships with Tier-1 carriers ensuring our broadcast signals reach every corner of the globe with zero compromise.",
                            icon: Globe,
                            color: "from-red-500 to-red-600"
                        },
                        {
                            title: "Data Sovereignty",
                            description: "Collaborating with leading cybersecurity firms to maintain an unbreakable chain of custody for all live match data.",
                            icon: Shield,
                            color: "from-blue-500 to-blue-600"
                        },
                        {
                            title: "Infrastructure",
                            description: "Powered by the world's most advanced fiber networks and edge computing nodes for ultimate 100ms latency.",
                            icon: Cpu,
                            color: "from-zinc-800 to-zinc-900"
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-12 bg-zinc-50/50 backdrop-blur-3xl border border-zinc-100 rounded-[3rem] overflow-hidden"
                        >
                            {/* Animated Background Highlight */}
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity duration-700`} />

                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-white`}>
                                    <feature.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 mb-6 leading-none">{feature.title}</h3>
                                <p className="text-base text-zinc-500 font-bold leading-relaxed tracking-tight">
                                    {feature.description}
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-zinc-100 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Section_0{idx + 1}</span>
                                <div className="w-2 h-2 rounded-full bg-zinc-200 group-hover:bg-red-500 transition-colors duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* High-Fidelity Network Section */}
                <section className="bg-zinc-900 py-48 px-6 text-white relative overflow-hidden">
                    {/* Background Tech Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/40 to-black" />

                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-12"
                        >
                            <Layers className="w-3 h-3" />
                            Global Infrastructure
                        </motion.div>

                        <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-[ -0.05em] mb-24 leading-none">
                            The <span className="text-zinc-600">Freedom</span> <br />
                            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">Network</span>
                        </h2>

                        {/* Asymmetric Floating Logos */}
                        <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center max-w-5xl mx-auto">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1, opacity: 1 }}
                                    className="relative group cursor-pointer opacity-20 transition-all duration-700"
                                >
                                    <div className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white hover:text-red-500 transition-colors">
                                        Partner_{i}
                                    </div>
                                    <div className="absolute -bottom-4 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-500" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Massive Quote Section */}
                <section className="py-64 px-6 bg-white overflow-hidden relative">
                    <div className="max-w-6xl mx-auto relative z-10">
                        <motion.div
                            initial={{ rotate: -5, opacity: 0 }}
                            whileInView={{ rotate: 0, opacity: 1 }}
                            className="bg-zinc-950 p-16 md:p-32 rounded-[4rem] text-white relative shadow-[0_100px_150px_rgba(0,0,0,0.15)]"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Star className="w-40 h-40 fill-white" />
                            </div>

                            <Star className="w-16 h-16 text-red-500 mb-12 fill-red-500" />

                            <blockquote className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] mb-16">
                                "The speed, reliability, and sheer <br />
                                scale of FGSN's platform is the <br />
                                gold standard for our industry."
                            </blockquote>

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-red-500 ring-4 ring-red-500/20" />
                                <div>
                                    <p className="text-2xl font-black uppercase tracking-tight italic">Marcus Sterling</p>
                                    <p className="text-sm font-black text-red-500 uppercase tracking-widest">VP Engineering / Global Media</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Ultra CTA */}
                <section className="px-6 pb-64 bg-white">
                    <div className="max-w-7xl mx-auto relative">
                        {/* Abstract Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5 blur-3xl pointer-events-none" />

                        <div className="relative text-center">
                            <h2 className="text-6xl md:text-[14rem] font-black uppercase italic tracking-tighter leading-none mb-20">
                                Start <br />
                                <span className="text-zinc-200 outline-text">Building</span>
                            </h2>

                            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                                <Link href="/reach-us" className="w-full md:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full md:w-auto px-20 py-8 bg-black text-white font-black uppercase tracking-widest text-sm rounded-[2rem] shadow-2xl hover:bg-zinc-900 transition-colors flex items-center justify-center gap-4 group"
                                    >
                                        Request Access
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </motion.button>
                                </Link>

                                <motion.button
                                    whileHover={{ opacity: 0.7 }}
                                    className="text-lg font-black uppercase tracking-widest border-b-4 border-zinc-900 pb-2"
                                >
                                    Network Specs
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            <style jsx>{`
                .outline-text {
                    -webkit-text-stroke: 2px #e4e4e7;
                    color: white;
                }
                @media (min-width: 768px) {
                    .outline-text {
                        -webkit-text-stroke: 4px #e4e4e7;
                    }
                }
            `}</style>
        </div>
    );
}
