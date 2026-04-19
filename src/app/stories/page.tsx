"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { Quote, Star } from "lucide-react";

const stories = [
    {
        name: "Dr. Sarah Chen",
        role: "AI Ethics Researcher",
        content: "Nexttask allowed me to contribute to frontier safety research while maintaining my academic position. The flexibility is unmatched.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
    },
    {
        name: "Marcus Thorne",
        role: "Principal ML Engineer",
        content: "The quality of labs on the platform is incredible. I'm working with the teams building the next generation of LLMs.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function StoriesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">Expert Stories</h1>
                        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                            Hear from the professionals shaping the future of artificial intelligence.
                        </p>
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-5xl mx-auto space-y-20">
                        {stories.map((story, i) => (
                            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                                <div className="w-full md:w-1/2 aspect-square rounded-[40px] overflow-hidden bg-zinc-100 shadow-2xl">
                                    <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <div className="flex text-blue-600 gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill="currentColor" />)}
                                    </div>
                                    <Quote className="text-zinc-200 w-16 h-16" />
                                    <p className="text-2xl font-bold leading-relaxed text-zinc-900">
                                        "{story.content}"
                                    </p>
                                    <div>
                                        <h4 className="text-lg font-black">{story.name}</h4>
                                        <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">{story.role}</p>
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
