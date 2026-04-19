"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";

const posts = [
    {
        title: "The Future of Human-in-the-Loop AI",
        excerpt: "Exploring why human expertise is more critical than ever as models scale.",
        date: "April 15, 2026",
        author: "Alex Rivera",
        category: "Research",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Scaling Data Pipelines for LLMs",
        excerpt: "Our journey building the world's most efficient data platform for AI labs.",
        date: "March 28, 2026",
        author: "Samantha Wu",
        category: "Engineering",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">Nexttask Blog</h1>
                        <p className="text-xl text-zinc-600 max-w-2xl">
                            Insights from the frontier of AI development and human intelligence.
                        </p>
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                        {posts.map((post, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[16/9] rounded-[40px] overflow-hidden bg-zinc-100 mb-8 border border-zinc-200">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-xs font-bold text-blue-600 uppercase tracking-widest">
                                        <span>{post.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                        <span className="text-zinc-400">{post.date}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold group-hover:text-blue-600 transition-colors">{post.title}</h3>
                                    <p className="text-zinc-600 text-lg leading-relaxed">{post.excerpt}</p>
                                    <div className="flex items-center gap-2 pt-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <User size={16} className="text-zinc-400" />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-900">{post.author}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </FadeIn>
            <Footer />
        </main>
    );
}
