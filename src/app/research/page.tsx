"use client";

import { motion } from "framer-motion";
import { Database, Microscope, Zap, BarChart3 } from "lucide-react";

const researchSections = [
    {
        title: "Frontier Data",
        description: "We collect and curate high-fidelity datasets that power the next generation of foundational models.",
        icon: Database,
    },
    {
        title: "Advanced Evals",
        description: "Rigorous evaluation frameworks to measure model performance against human-level reasoning.",
        icon: Microscope,
    },
    {
        title: "Post-training",
        description: "Specialized tuning and alignment strategies to ensure safety and specialized capability.",
        icon: Zap,
    },
    {
        title: "Benchmarks",
        description: "Continuous benchmarking against industry standards and proprietary reasoning tasks.",
        icon: BarChart3,
    },
];

export default function ResearchPage() {
    return (
        <main className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <div className="mb-20 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-primary font-mono text-sm tracking-widest uppercase mb-4"
                    >
                        Foundation Research
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-8xl font-bold tracking-tight mb-8"
                    >
                        Frontier data for <br />
                        <span className="text-primary italic">frontier AI.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-3xl text-xl md:text-2xl text-secondary leading-relaxed"
                    >
                        Nexttask.ai Research is dedicated to building the infrastructure for the next
                        leap in artificial intelligence. We focus on the intersection of data quality,
                        human feedback, and model evaluation.
                    </motion.p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    {researchSections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="p-10 rounded-3xl bg-muted/30 border border-border hover:border-primary/50 transition-colors group"
                        >
                            <section.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                            <p className="text-secondary leading-relaxed">
                                {section.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Benchmark Feature */}
                <div className="rounded-[40px] bg-black text-white p-12 md:p-20 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">Nexttask Benchmark v1.0</h2>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            Our proprietary benchmark tests models on complex coding, logical reasoning,
                            and agentic behavior. We provide the most accurate measure of a model's
                            true capability in real-world scenarios.
                        </p>
                        <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
                            Read the technical paper
                        </button>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/30 rounded-full blur-[120px]" />
                </div>
            </div>
        </main>
    );
}
