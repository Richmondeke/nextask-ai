'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Shield, Globe, Users, Trophy } from 'lucide-react';

const benefits = [
    {
        title: "Work from Anywhere",
        description: "Join the digital economy from any part of Africa. All you need is a laptop and internet.",
        icon: Globe,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Competitive Pay",
        description: "Earn in USD or local currency with rates starting from $15/hr for specialized roles.",
        icon: Trophy,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        title: "Flexible Hours",
        description: "Set your own schedule. Work full-time, part-time, or just a few hours on weekends.",
        icon: Zap,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "Vetted Network",
        description: "Join a community of the brightest PhDs, MAs, and graduates across the continent.",
        icon: Users,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        title: "Skill Growth",
        description: "Get trained by frontier AI labs and shape how the next generation of models think.",
        icon: CheckCircle2,
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
    {
        title: "Secure Payments",
        description: "Reliable weekly or monthly payouts directly to your bank account or digital wallet.",
        icon: Shield,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    }
];

export default function Benefits() {
    return (
        <section className="py-32 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6">
                        Why the world's best <br />
                        <span className="text-blue-600">choose Nexttask.</span>
                    </h2>
                    <p className="text-lg text-zinc-600 font-medium">
                        We provide the infrastructure and opportunities for Africa's most brilliant minds to excel in the global AI race.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${benefit.bg} ${benefit.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                <benefit.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-4">{benefit.title}</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
