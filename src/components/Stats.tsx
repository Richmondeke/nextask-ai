"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "Average pay", value: "$120", suffix: "/hr" },
    { label: "Roles created", value: "25k", prefix: "" },
    { label: "Daily payouts", value: "$450k", prefix: "" },
];

export default function Stats() {
    return (
        <section className="py-12 border-y border-border bg-muted/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center"
                        >
                            <span className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">
                                {stat.label}
                            </span>
                            <span className="text-4xl font-bold tracking-tight">
                                {stat.prefix}{stat.value}
                                <span className="text-xl text-secondary font-medium">{stat.suffix}</span>
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
