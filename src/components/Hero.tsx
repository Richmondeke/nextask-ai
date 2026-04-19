"use client";

import { motion } from "framer-motion";
import { MoveRight, Play } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium mb-6"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                        Empowering the next generation of AI developers
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
                    >
                        Shape the future <br className="hidden md:block" />
                        <span className="text-primary italic">of AI</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl text-lg md:text-xl text-secondary mb-10"
                    >
                        Find top-tier, remote, AI roles for your expertise.
                        Connect with leading AI labs and enterprises.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button className="bg-primary text-white scale-110 px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            Start working <MoveRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 border border-border hover:bg-muted transition-all">
                            <Play className="w-4 h-4 fill-current" /> Watch demo
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 opacity-30 blur-[100px] bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
        </section>
    );
}
