"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <article className="pt-40 pb-32 px-6">
                    <div className="max-w-3xl mx-auto prose prose-zinc prose-lg">
                        <h1 className="text-5xl font-black mb-12">Terms of Service</h1>
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-12">Last Updated: April 19, 2026</p>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-bold">1. Acceptance of Terms</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                By accessing or using Nexttask, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>

                            <h2 className="text-3xl font-bold">2. Use License</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                Permission is granted to temporarily download one copy of the materials (information or software) on Nexttask&apos;s website for personal, non-commercial transitory viewing only.
                            </p>

                            <h2 className="text-3xl font-bold">3. Disclaimer</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                The materials on Nexttask&apos;s website are provided on an &apos;as is&apos; basis. Nexttask makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>
                    </div>
                </article>
            </FadeIn>
            <Footer />
        </main>
    );
}
