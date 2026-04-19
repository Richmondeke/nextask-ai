"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { MoveRight, Search, Briefcase, DollarSign, Users, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Job {
    id: string;
    title: string;
    company: string;
    pay: string;
    hires: string;
    tags: string[];
    description: string;
}

export default function OpportunitiesPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const fetchedJobs = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        company: data.companyName || "Nexttask AI",
                        pay: data.salary || "Competitive",
                        hires: `${data.applicationCount || 0} applicants`,
                        tags: data.tags || [],
                        description: data.description || ""
                    };
                }) as Job[];
                setJobs(fetchedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <FadeIn>
                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6">
                            <span>🚀 Available roles at top AI labs</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                            Shape the future of AI
                        </h1>
                        <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-10">
                            Find top-tier, remote, AI roles for your expertise.
                            Available only on Nexttask.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/signup"
                                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                            >
                                Start working
                            </Link>
                            <div className="w-full sm:w-auto relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search roles..."
                                    className="w-full sm:w-64 pl-12 pr-6 py-4 rounded-full border border-zinc-100 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Job Listings */}
                <section className="py-20 px-6 bg-zinc-50/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-bold">Latest roles</h2>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full border border-zinc-200 hover:bg-white transition-colors">
                                    <MoveRight className="w-5 h-5 rotate-180" />
                                </button>
                                <button className="p-2 rounded-full border border-zinc-200 hover:bg-white transition-colors">
                                    <MoveRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                <p className="text-zinc-500 font-medium">Loading opportunities...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white p-6 rounded-[24px] border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200/50 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                                {job.title}
                                            </h3>
                                        </div>
                                        <p className="text-zinc-500 font-medium text-sm mb-6">{job.pay}</p>

                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-zinc-200 border-2 border-white" />
                                                ))}
                                            </div>
                                            <span className="text-xs text-zinc-400 font-medium">{job.hires}</span>
                                        </div>

                                        <Link
                                            href={`/login?redirect=/dashboard/explore?apply=${job.id}`}
                                            className="w-full flex items-center justify-end gap-2 text-sm font-bold text-zinc-400 group-hover:text-blue-600 transition-colors"
                                        >
                                            Apply <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </FadeIn>

            <Footer />
        </main>
    );
}
