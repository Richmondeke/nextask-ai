'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    MapPin,
    Github,
    Linkedin,
    Globe,
    Camera,
    Briefcase,
    GraduationCap,
    Plus
} from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="max-w-4xl space-y-12 pb-20">
            {/* Header / Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-12">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-5xl font-bold text-white shadow-2xl overflow-hidden">
                        JD
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-white text-black shadow-lg hover:bg-zinc-200 transition-colors">
                        <Camera size={18} />
                    </button>
                </div>
                <div className="text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">John Doe</h1>
                        <p className="text-zinc-500 text-lg">Senior Machine Learning Engineer</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-500" /> San Francisco, CA</span>
                        <span className="flex items-center gap-2"><Mail size={16} className="text-blue-500" /> john@nextask.ai</span>
                        <span className="flex items-center gap-2"><Briefcase size={16} className="text-blue-500" /> Full-time / Contract</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:text-white transition-colors"><Github size={20} /></button>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:text-white transition-colors"><Linkedin size={20} /></button>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:text-white transition-colors"><Globe size={20} /></button>
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <button className="text-sm font-semibold text-blue-500 hover:text-blue-400 px-2 py-1">Edit Socials</button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column: Info */}
                <div className="space-y-12">
                    {/* Bio Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">About</h2>
                            <button className="text-sm text-blue-500 font-semibold">Edit</button>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                            Passionate about building scalable AI systems and exploring the frontiers of Large Language Models.
                            Over 8 years of experience in distributed systems and machine learning infrastructure.
                        </p>
                    </section>

                    {/* Experience Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Experience</h2>
                            <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Staff ML Engineer</h3>
                                    <p className="text-sm text-zinc-400">DeepMind • 2021 – Present</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 shrink-0">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Senior Software Engineer</h3>
                                    <p className="text-sm text-zinc-400">OpenAI • 2018 – 2021</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Skills & Education */}
                <div className="space-y-12">
                    {/* Skills Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Skills</h2>
                            <button className="text-sm text-blue-500 font-semibold">Manage</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Python', 'PyTorch', 'Rust', 'Distributed Systems', 'LLMs', 'Transformer Architecture', 'Kubernetes', 'Next.js', 'Typescript'].map(skill => (
                                <span key={skill} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Education</h2>
                            <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-yellow-600/10 flex items-center justify-center text-yellow-500 shrink-0">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Stanford University</h3>
                                <p className="text-sm text-zinc-400">M.S. in Computer Science • 2018</p>
                            </div>
                        </div>
                    </section>

                    {/* Resume Card */}
                    <section className="p-6 rounded-3xl bg-white/5 border border-dashed border-white/20 hover:border-blue-500/50 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mx-auto group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <div>
                                <p className="font-bold">Update Resume</p>
                                <p className="text-xs text-zinc-500 mt-1">PDF, DOCX up to 10MB</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
