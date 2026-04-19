"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle } from "lucide-react";

const tabs = [
    {
        id: "prompt",
        label: "Write a Challenging Prompt",
        content: {
            title: "Write a Challenging Prompt",
            why: "Creating difficult problem/answer pairs helps teach and improve the accuracy of AI models.",
            how: "Think of a difficult question in your field of study - one that would confuse an AI model into writing an incorrect answer.\n\nThen, write the correct answer.",
            checklist: [
                "Is it a genuine, conversational, real-world task?",
                "Does it require reasoning over simple recall?",
                "Is it open-ended, allowing diverse solutions?",
            ]
        }
    },
    {
        id: "rubrics",
        label: "Create Grading Rubrics",
        content: {
            title: "Create Grading Rubrics",
            why: "Explicit criteria ensure consistency and high quality in model evaluation.",
            how: "Define clear standards for accuracy, tone, and formatting that the AI must follow.",
            checklist: [
                "Are the criteria objective and measurable?",
                "Do they cover edge cases and common errors?",
                "Is the grading scale easy to apply?",
            ]
        }
    },
    {
        id: "rank",
        label: "Rate and Rank Answers",
        content: {
            title: "Rate and Rank Answers",
            why: "Human preferences are the ultimate ground truth for helpful AI.",
            how: "Compare multiple model outputs and rank them based on specialized domain knowledge.",
            checklist: [
                "Which answer is more factually accurate?",
                "Which response follows the instructions better?",
                "Is the tone appropriate for the context?",
            ]
        }
    }
];

export default function PromptSection() {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Tab Headers */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-16 p-2 rounded-full bg-zinc-50 border border-zinc-100 w-fit mx-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all relative ${activeTab.id === tab.id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                                }`}
                        >
                            {activeTab.id === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-md border border-zinc-100 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-gradient-to-br from-orange-50/50 via-white to-blue-50/50 rounded-[48px] p-8 md:p-16 border border-zinc-100 shadow-sm relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        >
                            <div className="space-y-12">
                                <h3 className="text-4xl md:text-[56px] font-bold tracking-tight text-zinc-900 leading-[1.1]">
                                    {activeTab.content.title}
                                </h3>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">Why</p>
                                        <p className="text-lg text-zinc-600 leading-relaxed max-w-lg">
                                            {activeTab.content.why}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">How</p>
                                        <p className="text-lg text-zinc-600 leading-relaxed max-w-lg whitespace-pre-line">
                                            {activeTab.content.how}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Visual Mockup */}
                                <div className="bg-white rounded-3xl border border-zinc-100 shadow-2xl p-8 relative z-10">
                                    <div className="flex items-center gap-2 mb-8 border-b border-zinc-50 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-zinc-100" />
                                        <div className="w-3 h-3 rounded-full bg-zinc-100" />
                                        <div className="w-3 h-3 rounded-full bg-zinc-100" />
                                        <span className="ml-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                            {activeTab.label}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="h-4 bg-zinc-50 rounded-full w-full" />
                                        <div className="h-4 bg-zinc-50 rounded-full w-5/6" />
                                        <div className="h-4 bg-zinc-50 rounded-full w-4/6" />
                                    </div>

                                    <div className="p-6 rounded-2xl border-2 border-orange-500/20 bg-orange-50/10">
                                        <p className="text-sm font-bold mb-6 text-zinc-900">Prompt Checklist</p>
                                        <div className="space-y-4">
                                            {activeTab.content.checklist.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-50">
                                                    {idx === 0 ? (
                                                        <Check className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-zinc-300" />
                                                    )}
                                                    <span className="text-sm font-medium text-zinc-600">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative Blur */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 blur-[100px] -z-10 rounded-full" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
