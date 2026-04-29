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
    MoreHorizontal,
    Briefcase,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Zap,
    Edit3
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

export default function JobManagerPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPostModal, setShowPostModal] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        companyName: '',
        location: '',
        type: 'Full-time',
        salary: '',
        tags: '',
        description: '',
        testType: 'Practical / Case Study',
        questions: [] as any[],
        questionCount: 3
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

    const handleSaveJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsPosting(true);
            const jobData = {
                ...newJob,
                tags: typeof newJob.tags === 'string' ? newJob.tags.split(',').map(tag => tag.trim()) : newJob.tags,
                status: 'Active',
                updatedAt: new Date().toISOString(),
                applicationCount: 0
            };

            if (editingJobId) {
                await updateDoc(doc(db, 'jobs', editingJobId), jobData);
            } else {
                await addDoc(collection(db, 'jobs'), {
                    ...jobData,
                    createdAt: new Date().toISOString(),
                });
            }

            setShowPostModal(false);
            setEditingJobId(null);
            setNewJob({
                title: '',
                companyName: '',
                location: '',
                type: 'Full-time',
                salary: '',
                tags: '',
                description: '',
                testType: 'Practical / Case Study',
                questions: [],
                questionCount: 3
            });
            fetchJobs();
        } catch (error) {
            console.error('Error saving job:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleEditClick = (job: any) => {
        setEditingJobId(job.id);
        setNewJob({
            title: job.title || '',
            companyName: job.companyName || '',
            location: job.location || '',
            type: job.type || 'Full-time',
            salary: job.salary || '',
            tags: Array.isArray(job.tags) ? job.tags.join(', ') : job.tags || '',
            description: job.description || '',
            testType: job.testType || 'Practical / Case Study',
            questions: job.questions || [],
            questionCount: job.questions?.length || 3
        });
        setShowPostModal(true);
    };

    const generateAIQuestions = async () => {
        if (!newJob.title || !newJob.description) return;

        setIsGenerating(true);
        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockQuestions = Array.from({ length: newJob.questionCount }).map((_, i) => ({
            id: i + 1,
            question: i === 0
                ? `Based on the ${newJob.title} role, how would you approach a critical system failure during a peak traffic hour?`
                : i === 1
                    ? `Given the description: "${newJob.description.substring(0, 50)}...", what are the top 3 technical priorities you would set in your first 30 days?`
                    : `Task ${i + 1}: Implementation plan for a scalable ${newJob.tags.split(',')[0] || 'AI'} system.`,
            type: 'text'
        }));

        setNewJob(prev => ({ ...prev, questions: mockQuestions }));
        setIsGenerating(false);
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
                <LoadingSpinner size={40} />
                <p className="text-zinc-500 font-medium">Loading job listings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Job Manager</h1>
                    <p className="text-zinc-500 font-medium">Create, edit, and manage all job postings on Onionlabel.</p>
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
                                <h2 className="text-2xl font-bold text-zinc-900">{editingJobId ? 'Edit Role' : 'Post New Role'}</h2>
                                <p className="text-zinc-500 font-medium text-sm">
                                    {editingJobId ? 'Update the details for this job listing.' : 'Fill in the details for the new job listing.'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPostModal(false);
                                    setEditingJobId(null);
                                }}
                                className="p-2 hover:bg-zinc-50 rounded-xl transition-all"
                            >
                                <XCircle className="text-zinc-400" size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveJob} className="space-y-6">
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
                                        placeholder="e.g. Onionlabel AI"
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

                            <div className="pt-6 border-t border-zinc-100">
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Assessment Settings</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2">Test Type</label>
                                        <select
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium appearance-none"
                                            value={newJob.testType}
                                            onChange={(e) => setNewJob({ ...newJob, testType: e.target.value })}
                                        >
                                            <option>Practical / Case Study</option>
                                            <option>Multiple Choice Quiz</option>
                                            <option>Video Introduction</option>
                                            <option>Coding Challenge</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2">Question Count</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                            value={newJob.questionCount}
                                            onChange={(e) => setNewJob({ ...newJob, questionCount: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div className="flex items-end md:col-span-2">
                                        <button
                                            type="button"
                                            onClick={generateAIQuestions}
                                            disabled={isGenerating || !newJob.title}
                                            className="w-full py-3 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <LoadingSpinner size={16} />
                                            ) : (
                                                <Zap size={16} className="text-blue-600 fill-blue-600" />
                                            )}
                                            {newJob.questions.length > 0 ? 'Regenerate Questions' : 'AI Generate Questions'}
                                        </button>
                                    </div>
                                </div>

                                {newJob.questions.length > 0 && (
                                    <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Generated Questions ({newJob.questions.length})</p>
                                        {newJob.questions.map((q, i) => (
                                            <div key={i} className="bg-white p-3 rounded-lg border border-zinc-100 text-xs font-medium text-zinc-600 shadow-sm">
                                                {q.question}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPostModal(false);
                                        setEditingJobId(null);
                                    }}
                                    className="flex-1 py-4 bg-zinc-50 text-zinc-500 rounded-2xl font-bold hover:bg-zinc-100 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPosting}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPosting ? <LoadingSpinner size={18} /> : editingJobId ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                                    {editingJobId ? 'Save Changes' : 'Create Job Post'}
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
                            className="group p-4 sm:p-6 bg-white border border-zinc-100 rounded-[32px] shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                {/* Job Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                        <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${job.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-500">
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
                                            {job.companyName}
                                        </span>
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                                            {job.salary}
                                        </span>
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/20" />
                                            {job.type || 'Full-time'}
                                        </span>
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <Users className="w-3.5 h-3.5 opacity-60" />
                                            {job.applicationCount || 0} applicants
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-zinc-100">
                                    <button
                                        onClick={() => handleEditClick(job)}
                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-50 text-zinc-600 hover:bg-zinc-100 transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => toggleJobStatus(job.id, job.status)}
                                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${job.status === 'Active'
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                            }`}
                                    >
                                        {job.status === 'Active' ? (
                                            <>
                                                <XCircle className="w-4 h-4" />
                                                <span>Close</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Activate</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
