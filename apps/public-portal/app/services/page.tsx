import dynamic from 'next/dynamic';
import { ScrollStorytelling } from '../../components/ScrollStorytelling';
import { Tv, Presentation, Mic2, Construction, Settings, MonitorPlay, MapPin, Activity } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

const TransitionCamera = dynamic(() => import('@/components/TransitionCamera'), {
    ssr: false
});

export default function ServicesPage() {
    const services = [
        {
            title: "Broadcasting",
            desc: "Next-gen 4K UHD remote production and cloud-based broadcasting workflows. Our systems handle everything from signal acquisition to final multi-platform delivery.",
            icon: <Tv className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500",
            tags: ["4K UHD", "Cloud-Link", "Remote Ops"],
            image: "/images/services/broadcasting.png"
        },
        {
            title: "Hosting & Presentation",
            desc: "Global-scale event hosting for elite sports. We provide the digital and physical infrastructure to entertain millions across every touchpoint.",
            icon: <Presentation className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500",
            tags: ["Global Scale", "VOD", "Fan Engagement"],
            image: "/images/services/hosting.png"
        },
        {
            title: "Expert Casting",
            desc: "The voice of the game. Our casting network features world-class commentary and technical analysis that brings every play to life.",
            icon: <Mic2 className="w-6 h-6" />,
            color: "from-orange-500 to-red-500",
            tags: ["Expert VO", "Strategy Talk", "Live Hype"]
        },
        {
            title: "Technical Fabrication",
            desc: "Building the arenas of tomorrow. Custom set design, LED integration, and specialized technical infrastructure for premier leagues.",
            icon: <Construction className="w-6 h-6" />,
            color: "from-emerald-500 to-teal-500",
            tags: ["LED Sets", "Custom Build", "Arena Tech"],
            image: "/images/services/fabrication.png"
        },
        {
            title: "League Operations",
            desc: "Complete administrative control. Manage seasons, drafts, rule-sets, and player associations with industrial-grade precision.",
            icon: <Settings className="w-6 h-6" />,
            color: "from-amber-500 to-orange-500",
            tags: ["Season Mgmt", "Draft Engine", "Rule-Set Logic"]
        },
        {
            title: "Scoring Live Engine",
            desc: "The pulse of the match. Ultra-low latency data synchronization (<100ms) powering the world's most demanding sports broadcasts.",
            icon: <MonitorPlay className="w-6 h-6" />,
            color: "from-blue-600 to-indigo-600",
            tags: ["Low Latency", "99.9% Uptime", "JSON-Realtime"],
            image: "/images/services/scoring.png"
        },
        {
            title: "On Ground Operations",
            desc: "Boots on the ground. Venue management, technical logistics, and hardware deployment for high-stakes tournament environments.",
            icon: <MapPin className="w-6 h-6" />,
            color: "from-rose-500 to-red-500",
            tags: ["Venue Logistics", "Hardware Deploy", "On-Site Support"],
            image: "/images/services/venue.png"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/10">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01] grayscale" />
            </div>

            {/* Navbar */}
            <Navbar />

            <main className="relative z-10">
                <header className="max-w-7xl mx-auto px-6 py-12 md:py-24 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-zinc-900 text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 shadow-xl">
                        <Construction className="w-3 h-3 text-red-500" />
                        Professional Operations
                    </div>
                    <h1 className="text-5xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900 mb-8">
                        Our <br /> Process
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-bold uppercase tracking-tight">
                        End-to-end management for the modern sports ecosystem.
                    </p>
                </header>

                {/* Transition Space */}
                <div className="h-40 bg-white" />

                <TransitionCamera />

                <section className="bg-white relative">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10" />
                    <ScrollStorytelling services={services} />
                </section>
            </main>
            <Footer />
        </div>
    );
}
