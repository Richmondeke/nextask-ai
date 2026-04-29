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
                <div className="flex flex-wrap items-center justify-center gap-2 mb-16 p-2 rounded-md bg-zinc-50 border border-zinc-100 w-fit mx-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-md text-sm font-medium transition-all relative ${activeTab.id === tab.id ? "text-stripe-navy" : "text-zinc-500 hover:text-stripe-navy"
                                }`}
                        >
                            {activeTab.id === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-sm border border-zinc-200 rounded-md"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-lg p-8 md:p-16 border border-zinc-200 shadow-stripe-ambient relative">
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
                                <h3 className="text-4xl md:text-[56px] font-light tracking-[-1.4px] text-stripe-navy leading-[1.1]">
                                    {activeTab.content.title}
                                </h3>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 mb-3">Why</p>
                                        <p className="text-lg text-zinc-600 leading-relaxed max-w-lg">
                                            {activeTab.content.why}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 mb-3">How</p>
                                        <p className="text-lg text-zinc-600 leading-relaxed max-w-lg whitespace-pre-line">
                                            {activeTab.content.how}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Visual Mockup */}
                                <div className="bg-white rounded-md border border-zinc-200 shadow-stripe-deep p-8 relative z-10">
                                    <div className="flex items-center gap-2 mb-8 border-b border-zinc-100 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-zinc-200" />
                                        <div className="w-3 h-3 rounded-full bg-zinc-200" />
                                        <div className="w-3 h-3 rounded-full bg-zinc-200" />
                                        <span className="ml-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
                                            {activeTab.label}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="h-4 bg-zinc-100 rounded-sm w-full" />
                                        <div className="h-4 bg-zinc-100 rounded-sm w-5/6" />
                                        <div className="h-4 bg-zinc-100 rounded-sm w-4/6" />
                                    </div>

                                    <div className="p-6 rounded-md border border-zinc-200 bg-zinc-50">
                                        <p className="text-sm font-medium mb-6 text-stripe-navy">Prompt Checklist</p>
                                        <div className="space-y-4">
                                            {activeTab.content.checklist.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-md shadow-sm border border-zinc-200">
                                                    {idx === 0 ? (
                                                        <Check className="w-5 h-5 text-stripe-purple" />
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
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-stripe-purple/10 blur-[100px] -z-10 rounded-full" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
