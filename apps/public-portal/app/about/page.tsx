'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Shield, Zap, Mail, ArrowRight, UserPlus, Star, Cpu, Network } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10 selection:text-red-600">
            {/* Cinematic Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-zinc-50 via-white to-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:60px_60px] opacity-[0.4]" />

                {/* Floating Abstract Shapes */}
                <motion.div
                    animate={{ y: [0, -30, 0], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"
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
                        <Target className="w-3.5 h-3.5 text-red-500" />
                        Our Vision
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-12"
                    >
                        <span className="text-zinc-900 block">Redefining</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 drop-shadow-sm">
                            The Game
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-bold uppercase tracking-tight leading-relaxed italic"
                    >
                        Foundation Global Sports Network (FGSN) is the technological <br className="hidden md:block" />
                        backbone for the next generation of sports entertainment.
                    </motion.p>
                </header>

                {/* Premium Mission Blocks */}
                <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {[
                        {
                            title: "Global Connectivity",
                            description: "Creating a unified platform where local leagues can achieve global visibility through our centralized broadcast infrastructure.",
                            icon: Globe,
                            color: "from-red-500 to-red-600"
                        },
                        {
                            title: "Zero Latency",
                            description: "Our proprietary real-time engine ensures that data travels from the field to the fan in under 100 milliseconds.",
                            icon: Zap,
                            color: "from-blue-500 to-blue-600"
                        },
                        {
                            title: "Absolute Integrity",
                            description: "Built-in audit trails and role-based access control guarantee the accuracy and fairness of every scored point.",
                            icon: Shield,
                            color: "from-emerald-500 to-emerald-600"
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
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Pillar_0{idx + 1}</span>
                                <div className="w-2 h-2 rounded-full bg-zinc-200 group-hover:bg-red-500 transition-colors duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* High-Fidelity Squad Section */}
                <section className="bg-zinc-900 py-48 px-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/40 to-black" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-32">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-12"
                            >
                                <Cpu className="w-3 h-3" />
                                Leadership
                            </motion.div>

                            <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                                The <span className="text-zinc-600">Squad</span>
                            </h2>
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Architects of the new digital arena.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            {[
                                { name: "Sunny Bhandarkar", role: "Director" },
                                { name: "Pranav Prabhu", role: "Director" }
                            ].map((member, idx) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="group relative bg-zinc-800/20 backdrop-blur-xl p-12 rounded-[4rem] border border-white/5 hover:border-red-500/30 transition-all duration-500 h-full"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Star className="w-8 h-8 text-red-500 fill-red-500/10" />
                                    </div>

                                    <div className="relative z-10 text-center">
                                        <div className="w-40 h-40 mx-auto rounded-full bg-zinc-800 mb-10 overflow-hidden ring-4 ring-zinc-800 group-hover:ring-red-500/50 group-hover:scale-105 transition-all duration-700">
                                            <img
                                                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                                alt={member.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        </div>
                                        <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{member.name}</h4>
                                        <p className="text-red-500 font-black uppercase tracking-[0.3em] text-xs">
                                            {member.role}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Massive Typography Contact */}
                <section className="py-64 px-6 bg-white overflow-hidden relative">
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <motion.h2
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="text-6xl md:text-[14rem] font-black uppercase italic tracking-tighter leading-none mb-10"
                        >
                            Get in <br />
                            <span className="text-zinc-200 outline-text">Touch</span>
                        </motion.h2>
                        <p className="text-xl md:text-2xl text-zinc-400 font-bold uppercase tracking-tight mb-20 italic">
                            For partnerships, technical support, or press relations.
                        </p>

                        <div className="relative inline-block group">
                            <a
                                href="mailto:contact@fgsnlive.com"
                                className="text-4xl md:text-7xl font-black text-zinc-900 border-b-8 border-zinc-900 hover:text-red-600 hover:border-red-600 transition-all duration-500"
                            >
                                contact@fgsnlive.com
                            </a>
                            <motion.div
                                className="absolute -top-12 -right-12"
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Mail className="w-24 h-24 text-red-500/10 group-hover:text-red-500 transition-colors" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Ultra Join CTA */}
                <section className="px-6 pb-64 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="bg-zinc-950 p-16 md:p-32 rounded-[4rem] text-white relative shadow-[0_100px_150px_rgba(0,0,0,0.15)] overflow-hidden"
                        >
                            {/* Abstract Glow */}
                            <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[200%] bg-gradient-to-r from-red-600/20 via-transparent to-red-600/5 blur-[120px] pointer-events-none" />

                            <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-16">
                                <div>
                                    <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8">
                                        Join the <br /> <span className="text-red-500">Team</span>
                                    </h2>
                                    <p className="text-xl text-zinc-400 font-bold uppercase tracking-tight max-w-md">
                                        Become an architect of the next generation of global sports entertainment.
                                    </p>
                                </div>
                                <Link href="/careers">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-16 py-8 bg-white text-black font-black uppercase tracking-widest text-sm rounded-[2rem] shadow-2xl hover:bg-zinc-100 transition-colors flex items-center gap-4 group"
                                    >
                                        Apply Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
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
