"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { motion } from "framer-motion";
import {
    Cpu,
    ShieldCheck,
    Zap,
    MessageSquare,
    Code,
    Database,
    LineChart,
    Users,
    Globe
} from "lucide-react";

interface Feature {
    title: string;
    description: string;
    icon: any;
}

interface Vertical {
    name: string;
    desc: string;
    icon: any;
}

const enterpriseFeatures: Feature[] = [
    {
        title: "Model Customization",
        description: "Fine-tune models on your proprietary datasets with enterprise-grade privacy and security.",
        icon: Cpu
    },
    {
        title: "RLHF at Scale",
        description: "Access our elite network of 50,000+ domain experts for high-quality human feedback.",
        icon: ShieldCheck
    },
    {
        title: "Rapid Deployment",
        description: "Go from concept to production-ready AI agents in weeks, not months.",
        icon: Zap
    }
];

const verticals: Vertical[] = [
    {
        name: "Customer Support",
        desc: "Automate complex queries with context-aware AI agents that sound human.",
        icon: MessageSquare
    },
    {
        name: "Software Engineering",
        desc: "Accelerate development cycles with AI-assisted coding and automated testing.",
        icon: Code
    },
    {
        name: "Data Analysis",
        desc: "Transform unstructured data into actionable business intelligence instantly.",
        icon: Database
    }
];

export default function EnterprisePage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center text-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
                        >
                            Enterprise Solutions
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl text-zinc-900"
                        >
                            Custom AI Agents Built for <span className="text-blue-600">Your Business.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-2xl text-xl text-zinc-500 mb-12"
                        >
                            Seamlessly integrate specialized AI intelligence into your existing workflows
                            to drive efficiency, accuracy, and growth.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex gap-4"
                        >
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10">
                                Talk to Sales
                            </button>
                            <button className="bg-zinc-50 text-zinc-900 border border-zinc-100 px-8 py-4 rounded-full font-bold hover:bg-zinc-100 transition-all">
                                View Case Studies
                            </button>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
                        {enterpriseFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white border border-zinc-100 p-8 rounded-[32px] hover:shadow-2xl hover:shadow-blue-500/5 transition-all group"
                            >
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                    <feature.icon className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-zinc-900">{feature.title}</h3>
                                <p className="text-zinc-500 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Verticals Section */}
                    <div className="mb-40">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-zinc-900">Tailored for Every Team</h2>
                            <p className="text-zinc-500 max-w-xl mx-auto italic">Industry-leading performance across every function.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {verticals.map((v, i) => (
                                <motion.div
                                    key={v.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="flex items-start gap-6 p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100"
                                >
                                    <div className="mt-1">
                                        <v.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-2 text-zinc-900">{v.name}</h4>
                                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">{v.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Final Call to Action */}
                    <div className="bg-blue-600 rounded-[48px] p-12 md:p-24 text-white text-center shadow-2xl shadow-blue-500/10">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to evolve?</h2>
                        <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90">
                            Join the world's most innovative enterprises building their future with Nexttask AI.
                        </p>
                        <button className="bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-zinc-50 transition-all shadow-xl">
                            Schedule an onboarding call
                        </button>
                    </div>
                </div>
            </FadeIn>
            <Footer />
        </main>
    );
}
