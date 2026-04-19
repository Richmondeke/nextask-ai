'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ShieldCheck,
    FileText,
    Monitor,
    ClipboardList,
    Smartphone,
    CheckCircle2,
    MessageSquare,
    HelpCircle,
    ChevronRight,
    ChevronDown,
    Split
} from 'lucide-react';
import Link from 'next/link';

const steps = [
    { id: 'phone', label: 'Phone Verification', icon: Smartphone, status: 'upcoming' },
    { id: 'resume', label: 'Upload Resume', icon: FileText, status: 'completed' },
    { id: 'auth', label: 'Work Authorization', icon: ShieldCheck, status: 'completed' },
    { id: 'interview', label: 'Domain Expert Interview', icon: Monitor, status: 'completed', badge: 'CORE' },
    { id: 'evaluation', label: 'Model Response Evaluation (MRN)', icon: ClipboardList, status: 'active' },
];

export default function ApplicationAssessmentPage() {
    const [currentStep, setCurrentStep] = useState('evaluation');
    const [progress, setProgress] = useState(60);

    return (
        <div className="fixed inset-0 bg-white flex flex-col z-[100]">
            {/* Top Navigation */}
            <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 shrink-0 bg-white">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-xs font-bold hover:bg-zinc-50 transition-all">
                        <ChevronLeft size={14} />
                        Go back
                    </Link>
                    <span className="text-zinc-400 text-xs font-medium">View listing</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-xs font-bold hover:bg-zinc-50 transition-all">
                        FAQ
                    </button>
                    <button className="px-4 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-xs font-bold hover:bg-zinc-50 transition-all">
                        Contact support
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-80 border-r border-zinc-100 p-8 flex flex-col gap-10 shrink-0 overflow-y-auto">
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-zinc-900 leading-tight">Generalist Expert Application</h1>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-zinc-500">3 of 5 steps done</span>
                                <span className="text-zinc-900">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-blue-600 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${step.status === 'active'
                                    ? 'bg-blue-50/50 border-blue-600 text-blue-600 shadow-sm'
                                    : 'border-transparent text-zinc-500 hover:bg-zinc-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <step.icon size={20} strokeWidth={step.status === 'active' ? 2 : 1.5} />
                                    <span className="text-sm font-bold leading-tight max-w-[160px]">
                                        {step.label}
                                        {step.badge && (
                                            <span className="ml-2 px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-400 text-[8px] font-black uppercase tracking-widest leading-none align-middle">
                                                {step.badge}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {step.status === 'completed' && <CheckCircle2 size={18} className="text-blue-600 fill-blue-600 text-white" />}
                                {step.status === 'upcoming' && <div className="w-4 h-4 rounded-full border-2 border-zinc-100" />}
                                {step.status === 'active' && <div className="w-4 h-4 rounded-full border-2 border-blue-600" />}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-white p-12 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-zinc-900">Model Responses</h2>

                            <div className="flex border border-zinc-200 rounded-xl overflow-hidden min-h-[500px]">
                                {/* Response A */}
                                <div className="flex-1 border-r border-zinc-200 flex flex-col">
                                    <div className="px-5 py-3 bg-blue-100/50 text-blue-800 text-sm font-bold border-b border-zinc-200">
                                        Response A
                                    </div>
                                    <div className="p-8 text-sm leading-relaxed text-zinc-800 space-y-4">
                                        <p>It was decisive — without Catherine rolling up her own sleeve, Russia probably wouldn't have had a mass inoculation campaign at all. (And yes, historians get pedantic here: what she promoted in 1768 was **variolation/inoculation**, not Jenner's cowpox *vaccine* of 1796 — the idea of deliberately giving someone a mild case of smallpox using matter from a human pustule. The principle, and the public-relations problem, were the same.)</p>
                                        <h4 className="font-bold text-lg pt-4">1. Why Russians were terrified of it</h4>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>**Smallpox was a national trauma.** In the 1760s it killed 10% of those infected...</li>
                                            <li>**Inoculation looked insane.** You were *intentionally* giving a healthy person...</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Response B */}
                                <div className="flex-1 flex flex-col">
                                    <div className="px-5 py-3 bg-red-100/50 text-red-800 text-sm font-bold border-b border-zinc-200">
                                        Response B
                                    </div>
                                    <div className="p-8 text-sm leading-relaxed text-zinc-800 space-y-4">
                                        <p>Catherine the Great's personal participation in introducing smallpox immunization to Russia was not just important—it was the **single most crucial factor** in the success of the campaign. Without her leading by example, it is highly unlikely the practice would have gained traction among the Russian people.</p>
                                        <p>To understand the magnitude of her actions, it helps to look at the historical context, the profound risks she took, and the brilliant public relations strategy she built around her survival.</p>
                                        <p className="text-zinc-500 italic">Note: The procedure Catherine underwent in 1768 was called variolation or inoculation...</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Evaluation Form */}
                        <section className="space-y-8 pb-32">
                            {[1, 2, 3, 4].map((num) => (
                                <div key={num} className="flex gap-6">
                                    <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                        {num}
                                    </div>
                                    <div className="space-y-4 w-full">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-sm">
                                                <span className={num % 2 === 1 ? 'text-blue-600' : 'text-red-600'}>
                                                    Response {num % 2 === 1 ? 'A' : 'B'}
                                                </span>
                                                <span className="text-zinc-900"> - {num <= 2 ? 'Instruction Following' : 'Truthfulness'} *</span>
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                {num <= 2
                                                    ? 'How well did the model\'s response adhere to the prompt requirements?'
                                                    : 'How truthful and accurate to the real world was the model\'s response?'}
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <select className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-400 text-sm focus:outline-none appearance-none">
                                                <option>Select an option</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                </main>
            </div>

            {/* Footer Navigation */}
            <footer className="h-20 border-t border-zinc-100 bg-white flex flex-col shrink-0">
                <div className="h-1 bg-zinc-100 overflow-hidden">
                    <motion.div className="h-full bg-blue-600 w-0" />
                </div>
                <div className="flex-1 flex items-center justify-between px-8">
                    <button className="px-6 py-2 rounded-lg border border-zinc-200 text-zinc-600 text-sm font-bold hover:bg-zinc-50 transition-all">
                        Back
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-zinc-50 rounded-lg p-1">
                            <button className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-zinc-400 hover:bg-white hover:text-zinc-900 transition-all">1</button>
                            <button className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold bg-blue-600 text-white shadow-sm">2</button>
                            <button className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-zinc-400 hover:bg-white hover:text-zinc-900 transition-all">3</button>
                        </div>
                        <div className="w-8 h-8 border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400">
                            <Split size={14} />
                        </div>
                    </div>

                    <button className="px-8 py-2 rounded-lg bg-zinc-50 text-zinc-300 text-sm font-bold cursor-not-allowed">
                        Next
                    </button>
                </div>
            </footer>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4d4d8;
                }
            `}</style>
        </div>
    );
}
