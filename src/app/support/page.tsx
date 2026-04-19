"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { HelpCircle, MessageCircle, FileText, Search } from "lucide-react";

const faqs = [
    {
        q: "How do I get started?",
        a: "Sign up as an expert, complete your profile, and start applying to roles that match your skills."
    },
    {
        q: "When do I get paid?",
        a: "Payouts are processed once tasks are verified by the client. You can withdraw funds to your bank account anytime."
    },
    {
        q: "What types of roles are available?",
        a: "We have roles for AI researchers, software engineers, data scientists, and domain experts (PhD level)."
    }
];

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Help Center</h1>
                        <p className="text-lg text-zinc-600 mb-10">
                            Everything you need to know about working on Nexttask.
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            {[
                                { icon: HelpCircle, title: "Guides", desc: "Learn how to optimize your profile and earnings." },
                                { icon: MessageCircle, title: "Community", desc: "Join our discord to chat with other experts." },
                                { icon: FileText, title: "Policies", desc: "Read our guidelines for quality and conduct." }
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-3xl border border-zinc-100 bg-white hover:border-blue-500/20 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-zinc-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                                        <h3 className="font-bold text-zinc-900 mb-2">{faq.q}</h3>
                                        <p className="text-zinc-600 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </FadeIn>
            <Footer />
        </main>
    );
}
