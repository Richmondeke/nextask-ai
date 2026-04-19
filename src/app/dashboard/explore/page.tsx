'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    SlidersHorizontal,
    MapPin,
    DollarSign,
    Clock,
    ChevronRight,
    Filter
} from 'lucide-react';

const jobs = [
    {
        id: 1,
        title: 'Senior AI Research Engineer',
        company: 'Neural Labs',
        location: 'San Francisco (Remote)',
        salary: '$180k - $250k',
        type: 'Full-time',
        tags: ['PyTorch', 'Large Language Models', 'Optimization'],
        posted: '2 days ago'
    },
    {
        id: 2,
        title: 'Frontend Engineer (AI Tools)',
        company: 'ScaleAI',
        location: 'New York (Hybrid)',
        salary: '$140k - $190k',
        type: 'Contract',
        tags: ['React', 'Next.js', 'Typescript'],
        posted: '5 hours ago'
    },
    {
        id: 3,
        title: 'MLOps Architect',
        company: 'DataFlow',
        location: 'Remote',
        salary: '$160k - $220k',
        type: 'Full-time',
        tags: ['Kubernetes', 'AWS', 'TensorFlow'],
        posted: '1 day ago'
    },
    {
        id: 4,
        title: 'Product Designer (Generative)',
        company: 'Creaton',
        location: 'San Francisco',
        salary: '$150k - $210k',
        type: 'Full-time',
        tags: ['Product Design', 'UX', 'AI Art'],
        posted: '3 days ago'
    }
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Explore Roles</h1>
                    <p className="text-zinc-500 mt-2">Find your next project curated for your expertise.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search roles, skills..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <SlidersHorizontal size={20} className="text-zinc-400" />
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium whitespace-nowrap">All Roles</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">Engineering</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">Research</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">Product</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">Design</button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {jobs.map((job, index) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold text-xl shrink-0">
                                    {job.company[0]}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-zinc-500">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                                        <span className="flex items-center gap-1.5"><DollarSign size={14} /> {job.salary}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {job.posted}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 text-zinc-400 text-xs border border-white/5">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors text-sm">
                                    Quick Apply
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
