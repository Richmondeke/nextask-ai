"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function SecurityPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <FadeIn>
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <ShieldCheck size={40} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">Security at Nexttask</h1>
                        <p className="text-xl text-zinc-600">
                            We take security seriously. Our platform is built to protect the sensitive research and data of our partners and experts.
                        </p>
                    </div>
                </section>

                <section className="py-20 px-6 bg-zinc-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: Lock, title: "Data Encryption", desc: "All data is encrypted at rest and in transit using AES-256 and TLS 1.3." },
                                { icon: Eye, title: "Access Control", desc: "Strict role-based access control (RBAC) and least-privilege principles." },
                                { icon: FileText, title: "Compliance", desc: "SOC 2 Type II compliant and regular third-party security audits." }
                            ].map((item, i) => (
                                <div key={i} className="p-10 rounded-[40px] bg-white border border-zinc-200 shadow-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-900 flex items-center justify-center mb-6">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-32 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8">Reporting Vulnerabilities</h2>
                        <p className="text-lg text-zinc-600 mb-6">
                            If you believe you have discovered a security vulnerability in Nexttask, please contact our security team at <span className="text-blue-600 font-bold">security@nexttask.ai</span>.
                        </p>
                        <p className="text-lg text-zinc-600">
                            We appreciate your help in keeping our platform and community safe.
                        </p>
                    </div>
                </section>
            </FadeIn>
            <Footer />
        </main>
    );
}
