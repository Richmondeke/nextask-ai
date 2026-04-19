"use client";

import { motion } from "framer-motion";
import { BadgeCheck, MoveRight } from "lucide-react";

const roles = [
    {
        title: "Accounting & Audit Expert",
        pay: "$500-$1k",
        hires: "42 hired recently",
        tags: ["Finance", "Entry"],
    },
    {
        title: "Python Software Engineer",
        pay: "$100/hr",
        hires: "3 hired recently",
        tags: ["Engineering", "Applied"],
    },
    {
        title: "Biologist (PhD)",
        pay: "$105/hr",
        hires: "6 hired recently",
        tags: ["Research", "PhD"],
    },
    {
        title: "iOS/macOS Expert",
        pay: "$70/hr",
        hires: "107 hired recently",
        tags: ["Engineering", "Apps"],
    },
];

export default function Jobs() {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900">Latest roles</h2>
                    <button className="text-sm font-bold flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:gap-3 transition-all">
                        View all roles <MoveRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {roles.map((role, i) => (
                        <motion.div
                            key={role.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="group p-8 rounded-[32px] border border-zinc-200 bg-white hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex gap-2">
                                    {role.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <BadgeCheck className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
                                {role.title}
                            </h3>

                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold text-zinc-900">{role.pay}</span>
                                <span className="text-xs text-zinc-500 font-medium italic">
                                    {role.hires}
                                </span>
                            </div>

                            <div className="mt-8">
                                <button className="w-full py-4 rounded-full border border-zinc-200 text-sm font-bold text-zinc-900 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
                                    Apply Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
