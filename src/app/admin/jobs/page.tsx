'use client';

import React, { useEffect, useState } from 'react';
import {
    getDocs,
    collection,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    addDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Briefcase,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobManagerPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPostModal, setShowPostModal] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        companyName: '',
        location: '',
        type: 'Full-time',
        salary: '',
        tags: '',
        description: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const jobData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setJobs(jobData);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsPosting(true);
            const jobToAdd = {
                ...newJob,
                tags: newJob.tags.split(',').map(tag => tag.trim()),
                status: 'Active',
                createdAt: new Date().toISOString(),
                applicationCount: 0
            };
            await addDoc(collection(db, 'jobs'), jobToAdd);
            setShowPostModal(false);
            setNewJob({
                title: '',
                companyName: '',
                location: '',
                type: 'Full-time',
                salary: '',
                tags: '',
                description: ''
            });
            fetchJobs();
        } catch (error) {
            console.error('Error posting job:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const toggleJobStatus = async (jobId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
        try {
            await updateDoc(doc(db, 'jobs', jobId), {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
            fetchJobs();
        } catch (error) {
            console.error('Error updating job status:', error);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-zinc-500 font-medium">Loading job listings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Job Manager</h1>
                    <p className="text-zinc-500 font-medium">Create, edit, and manage all job postings on Nexttask.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="bg-white border border-zinc-200 rounded-2xl pl-12 pr-6 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm w-full md:w-64 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowPostModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-zinc-900/20 active:scale-95"
                    >
                        <Plus size={18} />
                        Post Job
                    </button>
                </div>
            </div>

            {/* Post Job Modal */}
            {showPostModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900">Post New Role</h2>
                                <p className="text-zinc-500 font-medium text-sm">Fill in the details for the new job listing.</p>
                            </div>
                            <button
                                onClick={() => setShowPostModal(false)}
                                className="p-2 hover:bg-zinc-50 rounded-xl transition-all"
                            >
                                <XCircle className="text-zinc-400" size={24} />
                            </button>
                        </div>

                        <form onSubmit={handlePostJob} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Job Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Senior RLHF Engineer"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Company Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Nextask AI"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                        value={newJob.companyName}
                                        onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Location</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Remote or San Francisco"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                        value={newJob.location}
                                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Job Type</label>
                                    <select
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium appearance-none"
                                        value={newJob.type}
                                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                    >
                                        <option>Full-time</option>
                                        <option>Contract</option>
                                        <option>Part-time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Salary Range</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. $140k - $180k"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                        value={newJob.salary}
                                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Tags (Comma Seperated)</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Python, PyTorch, LLM"
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                        value={newJob.tags}
                                        onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Briefly describe the role and requirements..."
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium resize-none"
                                    value={newJob.description}
                                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPostModal(false)}
                                    className="flex-1 py-4 bg-zinc-50 text-zinc-500 rounded-2xl font-bold hover:bg-zinc-100 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPosting}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPosting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                    Create Job Post
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                    <p className="text-sm font-semibold text-zinc-400 mb-1">Active Roles</p>
                    <h3 className="text-2xl font-bold text-zinc-900">{jobs.filter(j => j.status === 'Active').length}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                    <p className="text-sm font-semibold text-zinc-400 mb-1">Total Applications</p>
                    <h3 className="text-2xl font-bold text-zinc-900">0</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                    <p className="text-sm font-semibold text-zinc-400 mb-1">Average Time-to-Hire</p>
                    <h3 className="text-2xl font-bold text-zinc-900">--</h3>
                </div>
            </div>

            {/* Job List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-[40px] border border-dashed border-zinc-200 p-20 text-center">
                        <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-zinc-900">No jobs found</h3>
                        <p className="text-zinc-500">Try adjusting your search or post a new role.</p>
                    </div>
                ) : (
                    filteredJobs.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-6"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                                <Briefcase size={24} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-zinc-900 truncate">{job.title}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {job.status || 'Active'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                                    <span className="flex items-center gap-1"><Users size={14} /> {job.applicationCount || 0} Applied</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> Created {job.createdAt?.seconds ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleJobStatus(job.id, job.status)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-50 text-zinc-600 hover:bg-zinc-100 transition-all"
                                >
                                    {job.status === 'Active' ? 'Close' : 'Reopen'}
                                </button>
                                <button className="p-2 text-zinc-400 hover:bg-zinc-50 rounded-xl transition-all">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
