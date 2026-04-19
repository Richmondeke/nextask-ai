'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Globe,
    Link,
    Calendar,
    Briefcase,
    GraduationCap,
    Award,
    CheckCircle2,
    Clock,
    XCircle,
    User,
    ChevronRight,
    FileText
} from 'lucide-react';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchUserDetails(params.id as string);
        }
    }, [params.id]);

    const fetchUserDetails = async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'profiles', userId));
            if (userDoc.exists()) {
                setUser({ id: userDoc.id, ...userDoc.data() });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'profiles', user.id), { status });
            setUser({ ...user, status });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading profile...</div>;
    if (!user) return <div className="p-10 text-center">User not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-bold text-sm"
            >
                <ArrowLeft size={18} />
                Back to Talent Pool
            </button>

            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[32px] bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                        {user.fullName?.[0] || 'U'}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900">{user.fullName}</h1>
                        <p className="text-lg text-zinc-500 font-medium">{user.headline || 'Professional'}</p>
                        <div className="flex items-center gap-4 mt-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.status === 'Vetted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                user.status === 'Interviewing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                {user.status || 'Applied'}
                            </span>
                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                                <Calendar size={14} />
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => updateStatus('Vetted')}
                        className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                        Mark as Vetted
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                        Schedule Interview
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary */}
                    <section className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Professional Summary</h3>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            {user.bio || 'No bio provided.'}
                        </p>
                    </section>

                    {/* Experience */}
                    <section className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">Work Experience</h3>
                            <Briefcase className="text-zinc-200" size={24} />
                        </div>
                        <div className="space-y-8">
                            {user.experience?.length > 0 ? (
                                user.experience.map((exp: any, i: number) => (
                                    <div key={i} className="relative pl-8 border-l border-zinc-100 pb-8 last:pb-0">
                                        <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-zinc-200" />
                                        <h4 className="font-bold text-zinc-900">{exp.role}</h4>
                                        <p className="text-blue-600 text-sm font-bold">{exp.company}</p>
                                        <p className="text-xs text-zinc-400 mt-1 font-medium">{exp.duration}</p>
                                        <p className="text-zinc-500 text-sm mt-3 leading-relaxed font-medium">{exp.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-400 text-sm italic">No experience added yet.</p>
                            )}
                        </div>
                    </section>

                    {/* Assessment Results */}
                    <section className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">Assessment Performance</h3>
                            <Award className="text-zinc-200" size={24} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: "Technical Proficiency", score: user.assessments?.technical || 0, color: "bg-blue-600" },
                                { label: "Reasoning & Logic", score: user.assessments?.logic || 0, color: "bg-purple-600" },
                                { label: "Communication", score: user.assessments?.communication || 0, color: "bg-orange-600" },
                                { label: "Frontier Research", score: user.assessments?.research || 0, color: "bg-emerald-600" }
                            ].map((item, i) => (
                                <div key={i} className="bg-zinc-50 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</span>
                                        <span className="font-black text-zinc-900">{item.score}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all duration-1000`}
                                            style={{ width: `${item.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Contact Info */}
                    <section className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-sm">
                        <h3 className="text-xl font-bold mb-8">Contact & Social</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Email Address</p>
                                    <p className="text-sm font-bold text-zinc-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Phone Number</p>
                                    <p className="text-sm font-bold text-zinc-900">{user.phoneNumber || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                                    <Link size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">LinkedIn Profile</p>
                                    <a href={user.linkedin} target="_blank" className="text-sm font-bold text-blue-600 hover:underline">View Profile</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-900 transition-all">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Resume / CV</p>
                                    <a href={user.resumeUrl} target="_blank" className="text-sm font-bold text-blue-600 hover:underline">Download PDF</a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Expertise */}
                    <section className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.skills?.map((skill: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-600">
                                    {skill}
                                </span>
                            )) || <p className="text-zinc-400 text-sm">No skills listed.</p>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
