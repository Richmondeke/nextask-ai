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
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Latest roles</h2>
                    <button className="text-sm font-semibold flex items-center gap-2 text-primary hover:gap-3 transition-all">
                        View all roles <MoveRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role, i) => (
                        <motion.div
                            key={role.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="group p-6 rounded-3xl border border-border bg-background hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-2">
                                    {role.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold text-secondary uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <BadgeCheck className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[56px]">
                                {role.title}
                            </h3>

                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold">{role.pay}</span>
                                <span className="text-xs text-secondary font-medium italic">
                                    {role.hires}
                                </span>
                            </div>

                            <div className="mt-6">
                                <button className="w-full py-2 rounded-full border border-border text-sm font-semibold group-hover:bg-foreground group-hover:text-background transition-all">
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
