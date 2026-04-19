"use client";

import { motion } from "framer-motion";
import { Globe, Clock, Zap, Star, LayoutGrid, Cpu } from "lucide-react";
import Jobs from "@/components/Jobs";

const perks = [
    {
        title: "Work Remotely",
        description: "Join the world's leading AI teams from anywhere on Earth. Flexibility is built into our DNA.",
        icon: Globe,
    },
    {
        title: "Flexible Hours",
        description: "Choose your own schedule. Whether you have 10 or 40 hours, there's a place for your expertise.",
        icon: Clock,
    },
    {
        title: "Top-Tier Pay",
        description: "Get paid what you're worth. Our experts earn industry-leading rates across all specialized domains.",
        icon: Zap,
    },
];

export default function ExpertsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center gap-16 mb-40">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
                        >
                            Work on the <br />
                            <span className="text-primary italic">leading edge.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl text-secondary mb-10 max-w-xl leading-relaxed"
                        >
                            Nexttask connects the world's most talented developers and researchers
                            with high-impact AI opportunities. Join thousands of experts building
                            the future of intelligence.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button className="bg-primary text-white scale-110 px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                Apply to join
                            </button>
                            <div className="flex items-center gap-3 px-6 py-4 rounded-full border border-border bg-muted/30">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-medium">Joined by 10k+ experts</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 p-8 rounded-[48px] bg-gradient-to-br from-muted/50 to-background border border-border shadow-2xl"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-background border border-border flex flex-col items-center justify-center text-center">
                                    <Star className="w-8 h-8 text-yellow-500 mb-3" />
                                    <span className="text-3xl font-bold">4.9/5</span>
                                    <span className="text-xs text-secondary uppercase font-bold tracking-wider">Rating</span>
                                </div>
                                <div className="p-6 rounded-3xl bg-background border border-border flex flex-col items-center justify-center text-center">
                                    <Cpu className="w-8 h-8 text-primary mb-3" />
                                    <span className="text-3xl font-bold">500+</span>
                                    <span className="text-xs text-secondary uppercase font-bold tracking-wider">AI Models</span>
                                </div>
                                <div className="p-6 rounded-3xl bg-background border border-border flex flex-col items-center justify-center text-center col-span-2">
                                    <LayoutGrid className="w-8 h-8 text-blue-500 mb-3" />
                                    <span className="text-2xl font-bold">$10M+</span>
                                    <span className="text-xs text-secondary uppercase font-bold tracking-wider">Total Payouts</span>
                                </div>
                            </div>
                        </motion.div>
                        {/* Backdrop glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[120px] -z-10 rounded-full" />
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-40">
                    {perks.map((perk, index) => (
                        <motion.div
                            key={perk.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center md:text-left"
                        >
                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                                <perk.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{perk.title}</h3>
                            <p className="text-secondary leading-relaxed">
                                {perk.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Reusing Jobs Component for current roles */}
                <div className="mb-40">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest AI Roles</h2>
                            <p className="text-secondary italic">Updated every hour. Apply directly with your profile.</p>
                        </div>
                        <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Browse all roles <Zap className="w-4 h-4 fill-current" />
                        </button>
                    </div>
                    <Jobs />
                </div>
            </div>
        </main>
    );
}
