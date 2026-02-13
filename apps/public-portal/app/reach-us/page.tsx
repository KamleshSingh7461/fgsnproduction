
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';

export default function ReachUsPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-gradient-to-l from-zinc-50 to-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01] grayscale" />
            </div>

            {/* Navbar */}
            <Navbar />

            <main className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Left Column: Info */}
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-zinc-900 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-8 shadow-xl">
                            <Mail className="w-3 h-3 text-red-500" />
                            Direct Line
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 mb-8 break-words">
                            Start The Conversation
                        </h1>
                        <p className="text-xl text-zinc-500 font-bold uppercase tracking-tight mb-12 max-w-lg">
                            Whether you're organizing a league, broadcasting an event, or seeking partnership, our team is ready to deploy.
                        </p>

                        <div className="flex flex-col gap-8 border-t border-zinc-100 pt-12">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                                    <MapPin className="w-5 h-5 text-zinc-900" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase text-zinc-900 mb-1">Global HQ</h4>
                                    <p className="text-zinc-500 text-sm">
                                        6/A, Ambica Darshan Society, C.P. Road <br />
                                        Kandivali East, Mumbai, Maharastra, India, 400101
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                                    <Mail className="w-5 h-5 text-zinc-900" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase text-zinc-900 mb-1">Email Support</h4>
                                    <p className="text-zinc-500 text-sm">
                                        support@eusaiteam.com
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                                    <Phone className="w-5 h-5 text-zinc-900" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase text-zinc-900 mb-1">Call Center</h4>
                                    <p className="text-zinc-500 text-sm">
                                        +91 84549 91816 <br />
                                        Mon-Fri, 9am - 6pm PST
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl border border-zinc-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 mb-8 relative z-10">
                            Inquiry Form
                        </h3>
                        <ContactForm />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
