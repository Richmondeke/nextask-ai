"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <article className="pt-40 pb-32 px-6">
                    <div className="max-w-3xl mx-auto prose prose-zinc prose-lg">
                        <h1 className="text-5xl font-black mb-12">Privacy Policy</h1>
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-12">Last Updated: April 19, 2026</p>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-bold">1. Information We Collect</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account, apply for an opportunity, or communicate with us.
                            </p>

                            <h2 className="text-3xl font-bold">2. How We Use Your Information</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                We use the information we collect to provide, maintain, and improve our services, to process applications, and to communicate with you about Nexttask.
                            </p>

                            <h2 className="text-3xl font-bold">3. Data Security</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                            </p>
                        </section>
                    </div>
                </article>
            </FadeIn>
            <Footer />
        </main>
    );
}
