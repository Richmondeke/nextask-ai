'use client';

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import {
    MoveRight,
    Zap,
    Heart,
    MapPin,
    Shield,
    Coffee,
    Clock,
    Smartphone,
    Layers,
    Play,
    CheckCircle2,
    Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const benefits = [
    { icon: <Zap className="w-6 h-6" />, title: "Equity", desc: "Generous equity grant" },
    { icon: <Coffee className="w-6 h-6" />, title: "Meals", desc: "A monthly stipend for food" },
    { icon: <Heart className="w-6 h-6" />, title: "Wellness", desc: "Monthly wellness stipend" },
    { icon: <MapPin className="w-6 h-6" />, title: "Proximity bonus", desc: "Housing support near office" },
    { icon: <Shield className="w-6 h-6" />, title: "Insurance", desc: "Premium health coverage" },
    { icon: <Smartphone className="w-6 h-6" />, title: "Relocation", desc: "Relocation assistance" },
    { icon: <Clock className="w-6 h-6" />, title: "Time off", desc: "Unlimited paid vacation" },
    { icon: <Layers className="w-6 h-6" />, title: "401k", desc: "With employer match" },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: "Parental leave", desc: "For all new parents" },
];

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    salary: string;
    tags: string[];
}

export default function ExpertsPage() {
    const [jobs, setJobs] = useState<Record<string, Job[]>>({});
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const categorized: Record<string, Job[]> = {
                    Engineering: [],
                    Operations: [],
                    Marketing: [],
                    Other: []
                };

                querySnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const job = {
                        id: doc.id,
                        title: data.title,
                        location: data.location || "Remote",
                        type: data.type || "Full time",
                        salary: data.salary || data.pay || "Competitive",
                        tags: data.tags || []
                    };

                    const tags = (job.tags as string[]).map((t: string) => t.toLowerCase());
                    if (tags.some((t: string) => t.includes('engine') || t.includes('dev') || t.includes('ml') || t.includes('security') || t.includes('infra') || t.includes('tech'))) {
                        categorized.Engineering.push(job);
                    } else if (tags.some((t: string) => t.includes('op') || t.includes('project') || t.includes('manag') || t.includes('stratetg'))) {
                        categorized.Operations.push(job);
                    } else if (tags.some((t: string) => t.includes('mark') || t.includes('sal') || t.includes('grow'))) {
                        categorized.Marketing.push(job);
                    } else {
                        categorized.Other.push(job);
                    }
                });

                setJobs(categorized);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const categories = ["All", "Engineering", "Marketing", "Operations"];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <FadeIn>
                {/* Hero */}
                <section className="pt-32 pb-20 px-6 text-center">
                    <div className="max-w-7xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6">
                            <span>🚀 Join the fastest-growing company</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                            Work at Nexttask: <br />Build the Future of AI
                        </h1>
                        <Link
                            href="#open-roles"
                            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                        >
                            View open roles
                        </Link>

                        <div className="mt-20 rounded-[32px] overflow-hidden bg-zinc-100 aspect-video relative group border-8 border-white shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                                alt="Team working"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-blue-600 fill-blue-600 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Us */}
                <section className="py-24 px-6 bg-zinc-50/50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">About us</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-12 max-w-3xl">
                            We connect people with the leading AI labs and enterprises to provide the human expertise essential to AI development.
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
                                <h4 className="text-3xl font-bold mb-2">$10 billion valuation</h4>
                                <p className="text-zinc-500">We are a profitable Series C company</p>
                            </div>
                            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
                                <h4 className="text-3xl font-bold mb-2">Collaboration</h4>
                                <p className="text-zinc-500">We work in person from our HQ</p>
                            </div>
                            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
                                <h4 className="text-3xl font-bold mb-2">Frontier of AI</h4>
                                <p className="text-zinc-500">Work directly with leading AI researchers</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                            {[
                                { name: "Kailash", role: "Product Designer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
                                { name: "Abby", role: "ML Engineer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" },
                                { name: "Ayushi", role: "Ops Lead", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" },
                            ].map((person) => (
                                <div key={person.name} className="flex-shrink-0 w-[350px] aspect-[4/5] bg-zinc-100 rounded-[32px] relative overflow-hidden snap-center group">
                                    <Image src={person.img} alt={person.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <p className="font-bold text-xl">{person.name}</p>
                                        <p className="text-white/80 text-sm">{person.role}</p>
                                    </div>
                                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-24 px-6 bg-zinc-50/50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Benefits</h2>
                        <p className="text-zinc-600 mb-12 max-w-2xl">
                            Nexttask is built for people who thrive in high-velocity environments. We welcome builders who want to grow in their career faster than anywhere else.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {benefits.map((benefit) => (
                                <div key={benefit.title} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-zinc-50 rounded-2xl text-blue-600">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{benefit.title}</h4>
                                        <p className="text-sm text-zinc-500">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Open Roles */}
                <section id="open-roles" className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            <div className="md:col-span-1">
                                <h2 className="text-3xl font-bold mb-4">Open Roles</h2>
                                <p className="text-zinc-600 mb-8">We&apos;re looking for exceptional people to join our growing team.</p>
                                <div className="space-y-4">
                                    {categories.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setActiveFilter(tag)}
                                            className={`block text-sm font-bold transition-colors ${activeFilter === tag ? "text-blue-600" : "text-zinc-400 hover:text-blue-600"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        {Object.entries(jobs)
                                            .filter(([category]) => activeFilter === "All" || activeFilter === category)
                                            .map(([category, categoryJobs]) => (
                                                categoryJobs.length > 0 && (
                                                    <div key={category}>
                                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-100 pb-2">
                                                            {category} ({categoryJobs.length} roles)
                                                        </h3>
                                                        <div className="divide-y divide-zinc-50">
                                                            {categoryJobs.map(role => (
                                                                <Link
                                                                    href="/opportunities"
                                                                    key={role.id}
                                                                    className="py-6 flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer"
                                                                >
                                                                    <div>
                                                                        <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{role.title}</h4>
                                                                        <p className="text-zinc-500 text-sm font-medium">
                                                                            {role.location} · {role.type} · {role.salary}
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-4 sm:mt-0 text-zinc-400 group-hover:text-blue-600 transition-colors">
                                                                        <MoveRight className="w-5 h-5" />
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            ))}

                                        {!loading && Object.values(jobs).every(arr => arr.length === 0) && (
                                            <div className="text-center py-20 text-zinc-500">
                                                No open roles found at this time. Check back soon!
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </FadeIn>

            <Footer />
        </main>
    );
}
