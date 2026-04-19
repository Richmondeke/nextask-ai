"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { Briefcase, Heart, Globe, Zap } from "lucide-react";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">Join the Core Team</h1>
                        <p className="text-xl text-zinc-600 mb-10">
                            We're building the infrastructure for the future of AI work.
                            Help us connect the world's best minds.
                        </p>
                    </div>
                </section>

                <section className="py-20 px-6 bg-zinc-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                            {[
                                { icon: Globe, title: "Remote First", desc: "Work from anywhere in the world." },
                                { icon: Heart, title: "Health & Wellness", desc: "Full medical coverage and fitness stipend." },
                                { icon: Zap, title: "Fast Growth", desc: "Be part of a rapidly scaling AI startup." },
                                { icon: Briefcase, title: "High Impact", desc: "Your work defines how AI labs operate." }
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white border border-zinc-200">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-zinc-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-[40px] p-12 border border-zinc-200 text-center">
                            <h2 className="text-3xl font-bold mb-4">No open corporate roles?</h2>
                            <p className="text-zinc-500 mb-8">We're always looking for talented researchers and engineers to join our Expert Network.</p>
                            <a href="/opportunities" className="inline-block bg-zinc-900 text-white px-10 py-4 rounded-full font-bold hover:bg-zinc-800 transition-all">
                                Explore Expert Roles
                            </a>
                        </div>
                    </div>
                </section>
            </FadeIn>
            <Footer />
        </main>
    );
}
