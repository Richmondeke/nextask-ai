"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, MoveRight, ArrowRight } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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
                        className="text-4xl md:text-5xl font-light tracking-[-1.4px] text-stripe-navy"
                    >
                        Latest roles
                    </motion.h2>
                    <Link
                        href="/opportunities"
                        className="group text-sm font-medium flex items-center gap-2 text-stripe-purple hover:text-stripe-navy transition-colors"
                    >
                        View all roles <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size={32} />
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
                                className="group p-8 rounded-md border border-zinc-200 bg-white shadow-stripe-ambient hover:shadow-stripe-blue transition-shadow cursor-pointer relative"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex flex-wrap gap-2">
                                        {(job.tags || ["AI", "Expert"]).slice(0, 2).map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-md bg-zinc-100 text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <BadgeCheck className="w-5 h-5 text-stripe-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="text-xl font-medium mb-4 text-stripe-navy group-hover:text-stripe-purple transition-colors line-clamp-2 min-h-[56px]">
                                    {job.title}
                                </h3>

                                <div className="flex flex-col gap-1 mb-8">
                                    <span className="text-2xl font-light tracking-[-0.5px] text-stripe-navy">{job.pay}</span>
                                    <span className="text-xs text-zinc-500 font-medium">
                                        {job.hires}
                                    </span>
                                </div>

                                <Link
                                    href={`/login?redirect=/dashboard/explore?apply=${job.id}`}
                                    className="flex items-center justify-between w-full py-3 px-6 rounded-md border border-zinc-200 text-sm font-medium text-stripe-navy group-hover:bg-stripe-navy group-hover:text-white group-hover:border-stripe-navy transition-all"
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
