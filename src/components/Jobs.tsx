"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, MoveRight, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Job {
    id: string;
    title: string;
    company: string;
    pay: string;
    hires: string;
    tags: string[];
}

export default function Jobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const q = query(
                    collection(db, "jobs"),
                    orderBy("createdAt", "desc"),
                    limit(4)
                );
                const querySnapshot = await getDocs(q);
                const fetchedJobs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Job[];
                setJobs(fetchedJobs);
            } catch (error) {
                console.error("Error fetching homepage jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900"
                    >
                        Latest roles
                    </motion.h2>
                    <Link
                        href="/opportunities"
                        className="group text-sm font-bold flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all"
                    >
                        View all roles <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {jobs.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group p-8 rounded-[32px] border border-zinc-100 bg-white hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer relative"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex flex-wrap gap-2">
                                        {(job.tags || ["AI", "Expert"]).slice(0, 2).map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-full bg-zinc-50 text-[10px] font-bold text-zinc-400 border border-zinc-100 uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <BadgeCheck className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="text-xl font-bold mb-4 text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
                                    {job.title}
                                </h3>

                                <div className="flex flex-col gap-1 mb-8">
                                    <span className="text-2xl font-black text-zinc-900">{job.pay}</span>
                                    <span className="text-xs text-zinc-400 font-medium">
                                        {job.hires}
                                    </span>
                                </div>

                                <Link
                                    href={`/login?redirect=/dashboard/explore?apply=${job.id}`}
                                    className="flex items-center justify-between w-full py-4 px-6 rounded-full border border-zinc-100 text-sm font-bold text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all"
                                >
                                    Apply Now <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
