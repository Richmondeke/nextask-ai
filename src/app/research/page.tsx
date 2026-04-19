"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { motion } from "framer-motion";
import {
    Microscope,
    Library,
    Network,
    Terminal,
    Brain,
    Beaker
} from "lucide-react";

interface ResearchSection {
    title: string;
    description: string;
    icon: any;
}

const researchSections: ResearchSection[] = [
    {
        title: "Model Evaluation",
        description: "Developing rigorous frameworks to measure AI reasoning, safety, and operational capability.",
        icon: Microscope
    },
    {
        title: "Dataset Synthesis",
        description: "Researching methodologies for high-fidelity synthetic data generation and quality filtering.",
        icon: Library
    },
    {
        title: "Agentic Workflows",
        description: "Exploring the limits of multi-agent orchestration and long-horizon task completion.",
        icon: Network
    },
    {
        title: "Formal Verification",
        description: "Applying formal methods to ensure the correctness and reliability of AI-generated code.",
        icon: Terminal
    }
];

export default function ResearchPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                    {/* Hero Section */}
                    <div className="mb-20 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-blue-600 font-mono text-sm tracking-widest uppercase mb-4"
                        >
                            Foundation Research
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-zinc-900"
                        >
                            Frontier data for <br />
                            <span className="text-blue-600 italic">frontier AI.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-3xl text-xl md:text-2xl text-zinc-500 leading-relaxed font-medium"
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
                                className="p-10 rounded-[32px] bg-zinc-50/50 border border-zinc-100 hover:border-blue-500/30 transition-all group"
                            >
                                <section.icon className="w-10 h-10 text-blue-600 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl font-bold mb-4 text-zinc-900">{section.title}</h3>
                                <p className="text-zinc-500 leading-relaxed font-medium">
                                    {section.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Benchmark Feature */}
                    <div className="rounded-[40px] bg-zinc-900 text-white p-12 md:p-20 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Nexttask Benchmark v1.0</h2>
                            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium opacity-90">
                                Our proprietary benchmark tests models on complex coding, logical reasoning,
                                and agentic behavior. We provide the most accurate measure of a model's
                                true capability in real-world scenarios.
                            </p>
                            <button className="bg-white text-zinc-900 px-8 py-4 rounded-full font-bold hover:bg-zinc-100 transition-colors shadow-lg">
                                Read the technical paper
                            </button>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]" />
                    </div>
                </div>
            </FadeIn>
            <Footer />
        </main>
    );
}
