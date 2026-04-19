'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "Do I need prior AI experience?",
        answer: "No prior AI experience is needed for most roles. We're looking for subject matter experts (Math, Coding, Writing, Science) who can provide high-quality reasoning and data. We provide all the specialized tool training."
    },
    {
        question: "How do I get paid?",
        answer: "Nexttask supports multiple payout methods including direct bank transfers across 15+ African countries, digital wallets, and stablecoins. Payments are made either weekly or monthly depending on the project."
    },
    {
        question: "Is this full-time or part-time?",
        answer: "Both! Many of our professionals work full-time on specific lab projects, while others use Nexttask to earn extra income alongside their existing jobs or studies. You set your availability."
    },
    {
        question: "What kind of tasks will I perform?",
        answer: "Tasks include writing complex prompts to test AI capabilities, grading model outputs based on specific rubrics, ranking multiple answers, and providing step-by-step reasoning for difficult problems."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-32 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-6 font-bold">Frequently asked questions</h2>
                    <p className="text-zinc-500 font-medium font-medium">Everything you need to know about working with Nexttask.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-zinc-100 rounded-[32px] overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full p-8 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-all group"
                            >
                                <span className="font-bold text-lg text-zinc-900">{faq.question}</span>
                                <div className={`p-2 rounded-full transition-all ${openIndex === i ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200'}`}>
                                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-8">
                                            <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
