"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Target, Zap, Users, Code, Headset } from "lucide-react";

const enterpriseFeatures = [
    {
        title: "Absorb Context",
        description: "Our agents integrate deeply with your existing tools, docs, and codebase to understand your organizational DNA.",
        icon: Target,
    },
    {
        title: "Safe Deployment",
        description: "Built-in guardrails, SOC2 compliance, and end-to-end encryption for every interaction.",
        icon: ShieldCheck,
    },
    {
        title: "Ultra Performance",
        description: "Optimized pipelines ensuring sub-second response times for complex multi-step reasoning.",
        icon: Zap,
    },
];

const verticals = [
    { name: "Engineering", icon: Code, desc: "Automate code reviews, documentation, and feature implementation." },
    { name: "Sales", icon: Users, desc: "Personalized outreach, lead qualification, and CRM management." },
    { name: "Support", icon: Headset, desc: "High-fidelity resolution of complex customer queries at scale." },
];

export default function EnterprisePage() {
    return (
        <main className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
                    >
                        Enterprise Solutions
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl"
                    >
                        Custom AI Agents Built for <span className="text-primary">Your Business.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl text-xl text-secondary mb-12"
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
                        <button className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all">
                            Talk to Sales
                        </button>
                        <button className="bg-muted text-foreground border border-border px-8 py-4 rounded-full font-bold hover:bg-muted/80 transition-all">
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
                            className="bg-background border border-border p-8 rounded-[32px] hover:shadow-2xl hover:shadow-primary/5 transition-all"
                        >
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
                                <feature.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Verticals Section */}
                <div className="mb-40">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Tailored for Every Team</h2>
                        <p className="text-secondary max-w-xl mx-auto italic">Industry-leading performance across every function.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {verticals.map((v, i) => (
                            <motion.div
                                key={v.name}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex items-start gap-6 p-8 rounded-[32px] bg-muted/20 border border-border"
                            >
                                <div className="mt-1">
                                    <v.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2">{v.name}</h4>
                                    <p className="text-sm text-secondary leading-relaxed">{v.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final Call to Action */}
                <div className="bg-primary rounded-[48px] p-12 md:p-24 text-white text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to evolve?</h2>
                    <p className="text-primary-foreground/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                        Join the world's most innovative enterprises building their future with Nextask AI.
                    </p>
                    <button className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
                        Schedule an onboarding call
                    </button>
                </div>
            </div>
        </main>
    );
}
