'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Link as LinkIcon,
    Briefcase,
    GraduationCap,
    Award,
    Plus,
    Trash2,
    Calendar,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    Camera,
    Upload,
    UploadCloud,
    X,
    Globe,
    FileText,
    Check,
    CircleDollarSign,
    ChevronDown,
    Clock,
    Info,
    Shield,
    Lock,
    Zap
} from 'lucide-react';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import FadeIn from '@/components/FadeIn';

// Define types for profile data
interface WorkExperience {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    graduationDate: string;
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('Resume');
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [profileData, setProfileData] = useState({
        fullName: '',
        phone: '',
        linkedinUrl: '',
        noLinkedin: false,
        location: '',
        resume: null as { name: string; size: number; url: string; uploadedAt: string } | null,
        experience: [] as WorkExperience[],
        education: [] as Education[],
        // New sections
        country: '',
        city: '',
        workAuthorization: 'Authorized to work',
        visaRequired: false,
        domains: [] as string[],
        compensation: '',
        workStyle: 'Remote',
        // Availability
        timezone: '',
        weeklyHours: '',
        availabilityDate: '',
        // Communications
        emailNotifications: true,
        phoneAlerts: false
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await fetchProfileData(user.uid);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchProfileData = async (uid: string) => {
        try {
            const docRef = doc(db, 'profiles', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    linkedinUrl: data.linkedinUrl || '',
                    noLinkedin: data.noLinkedin || false,
                    location: data.location || '',
                    resume: data.resume || null,
                    experience: data.experience || [],
                    education: data.education || [],
                    country: data.country || '',
                    city: data.city || '',
                    workAuthorization: data.workAuthorization || 'Authorized to work',
                    visaRequired: data.visaRequired || false,
                    domains: data.domains || [],
                    compensation: data.compensation || '',
                    workStyle: data.workStyle || 'Remote',
                    timezone: data.timezone || '',
                    weeklyHours: data.weeklyHours || '',
                    availabilityDate: data.availabilityDate || '',
                    emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : true,
                    phoneAlerts: data.phoneAlerts !== undefined ? data.phoneAlerts : false
                });
            } else {
                setProfileData(prev => ({
                    ...prev,
                    fullName: auth.currentUser?.displayName || ''
                }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeUpload = async (file: File) => {
        if (!user) return;

        const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const resumeData = {
                    name: file.name,
                    size: file.size,
                    url: downloadURL,
                    uploadedAt: new Date().toISOString()
                };

                setProfileData(prev => ({ ...prev, resume: resumeData }));
                setUploadProgress(0);

                // NO MOCK PARSING - Just save the resume data
                await updateDoc(doc(db, 'profiles', user.uid), {
                    resume: resumeData,
                    updatedAt: new Date().toISOString()
                });
            }
        );
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await setDoc(doc(db, 'profiles', user.uid), {
                ...profileData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        'Resume',
        'Location & Work Authorization',
        'Work Preferences',
        'Availability',
        'Communications'
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center py-40">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <FadeIn>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 overflow-x-hidden">
                {/* Header */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 overflow-hidden relative group shrink-0">
                                {user?.photoURL ? (
                                    <Image src={user.photoURL} alt="p" fill className="object-cover" />
                                ) : (
                                    <User size={40} />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Plus size={20} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
                                    {profileData.fullName || 'Your Profile'}
                                </h1>
                                <p className="text-sm md:text-base text-zinc-500 font-medium">
                                    Software Engineer • {profileData.location || (profileData.city ? `${profileData.city}, ${profileData.country}` : 'Lagos, Nigeria')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full md:w-auto px-8 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {saveSuccess ? 'Changes Saved!' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Profile Navigation */}
                    <div className="border-b border-zinc-100 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="flex gap-8 whitespace-nowrap min-w-max sm:min-w-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-[13px] font-bold transition-all relative border-b-2 ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-zinc-400 border-transparent hover:text-zinc-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'Resume' && (
                            <motion.div
                                key="resume-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12 py-4"
                            >
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Basic info</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            This information will be visible to employers.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.fullName}
                                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                    placeholder="+234 ..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-100 w-full" />

                                {/* Resume Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Resume</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            Upload your resume to get matched with opportunities faster.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8">
                                        {profileData.resume ? (
                                            <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30 flex items-center justify-between group overflow-hidden">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-zinc-900 truncate">{profileData.resume.name}</p>
                                                        <p className="text-[11px] text-zinc-400 font-medium">
                                                            {(profileData.resume.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(profileData.resume.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <button
                                                        onClick={() => setProfileData({ ...profileData, resume: null })}
                                                        className="text-[11px] font-bold text-zinc-400 hover:text-red-600 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative group cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept=".pdf"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleResumeUpload(file);
                                                    }}
                                                />
                                                <div className="border-2 border-dashed border-zinc-100 rounded-2xl p-8 transition-all group-hover:bg-zinc-50 group-hover:border-blue-400 flex flex-col items-center justify-center gap-3 bg-zinc-50/50">
                                                    {uploadProgress > 0 ? (
                                                        <div className="w-full max-w-[200px] space-y-2">
                                                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-blue-600"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${uploadProgress}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-[11px] text-center font-bold text-blue-600">{Math.round(uploadProgress)}% Uploading</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-blue-50 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 shadow-sm transition-all border border-zinc-100 group-hover:border-blue-100">
                                                                <UploadCloud size={24} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-bold text-zinc-900">Click or drag resume here</p>
                                                                <p className="text-[12px] text-zinc-400 font-medium mt-1">PDF file up to 10MB</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-100 w-full" />

                                {/* Experience Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Work Experience</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            Your professional journey.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 space-y-6">
                                        {profileData.experience.length === 0 ? (
                                            <div className="p-8 border border-zinc-100 rounded-2xl bg-zinc-50/30 text-center space-y-2">
                                                <Briefcase className="w-8 h-8 text-zinc-300 mx-auto" />
                                                <p className="text-xs font-bold text-zinc-400">No work experience added yet.</p>
                                            </div>
                                        ) : (
                                            profileData.experience.map((exp, idx) => (
                                                <div key={exp.id} className="relative p-6 rounded-2xl border border-zinc-100 bg-white group hover:border-blue-200 transition-all space-y-4">
                                                    <button
                                                        onClick={() => {
                                                            const newExp = [...profileData.experience];
                                                            newExp.splice(idx, 1);
                                                            setProfileData({ ...profileData, experience: newExp });
                                                        }}
                                                        className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Role</label>
                                                            <input
                                                                type="text"
                                                                value={exp.role}
                                                                onChange={(e) => {
                                                                    const newExp = [...profileData.experience];
                                                                    newExp[idx].role = e.target.value;
                                                                    setProfileData({ ...profileData, experience: newExp });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-bold"
                                                                placeholder="e.g. Senior Software Engineer"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Company</label>
                                                            <input
                                                                type="text"
                                                                value={exp.company}
                                                                onChange={(e) => {
                                                                    const newExp = [...profileData.experience];
                                                                    newExp[idx].company = e.target.value;
                                                                    setProfileData({ ...profileData, experience: newExp });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-bold"
                                                                placeholder="e.g. Google"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location</label>
                                                            <input
                                                                type="text"
                                                                value={exp.location}
                                                                onChange={(e) => {
                                                                    const newExp = [...profileData.experience];
                                                                    newExp[idx].location = e.target.value;
                                                                    setProfileData({ ...profileData, experience: newExp });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                                                                placeholder="e.g. Lagos, Nigeria"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Start Date</label>
                                                            <input
                                                                type="text"
                                                                value={exp.startDate}
                                                                onChange={(e) => {
                                                                    const newExp = [...profileData.experience];
                                                                    newExp[idx].startDate = e.target.value;
                                                                    setProfileData({ ...profileData, experience: newExp });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                                                                placeholder="e.g. Jan 2022"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">End Date</label>
                                                            <input
                                                                type="text"
                                                                value={exp.endDate}
                                                                onChange={(e) => {
                                                                    const newExp = [...profileData.experience];
                                                                    newExp[idx].endDate = e.target.value;
                                                                    setProfileData({ ...profileData, experience: newExp });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                                                                placeholder="e.g. Present"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                                                        <textarea
                                                            value={exp.description}
                                                            onChange={(e) => {
                                                                const newExp = [...profileData.experience];
                                                                newExp[idx].description = e.target.value;
                                                                setProfileData({ ...profileData, experience: newExp });
                                                            }}
                                                            rows={3}
                                                            className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium resize-none"
                                                            placeholder="Describe your achievements and responsibilities..."
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <button
                                            onClick={() => {
                                                const newExp: WorkExperience = {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    company: '',
                                                    role: '',
                                                    location: '',
                                                    startDate: '',
                                                    endDate: '',
                                                    description: '',
                                                    current: false
                                                };
                                                setProfileData({ ...profileData, experience: [newExp, ...profileData.experience] });
                                            }}
                                            className="w-full p-4 rounded-2xl border-2 border-dashed border-zinc-100 flex items-center justify-center gap-2 text-[13px] font-bold text-zinc-400 hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
                                        >
                                            <Plus size={16} className="group-hover:scale-110 transition-transform" />
                                            Add experience
                                        </button>
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-100 w-full" />

                                {/* Education Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Education</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            Your academic background.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 space-y-6">
                                        {profileData.education.length === 0 ? (
                                            <div className="p-8 border border-zinc-100 rounded-2xl bg-zinc-50/30 text-center space-y-2">
                                                <GraduationCap className="w-8 h-8 text-zinc-300 mx-auto" />
                                                <p className="text-xs font-bold text-zinc-400">No education added yet.</p>
                                            </div>
                                        ) : (
                                            profileData.education.map((edu, idx) => (
                                                <div key={edu.id} className="relative p-6 rounded-2xl border border-zinc-100 bg-white group hover:border-blue-200 transition-all space-y-4">
                                                    <button
                                                        onClick={() => {
                                                            const newEdu = [...profileData.education];
                                                            newEdu.splice(idx, 1);
                                                            setProfileData({ ...profileData, education: newEdu });
                                                        }}
                                                        className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">School</label>
                                                            <input
                                                                type="text"
                                                                value={edu.school}
                                                                onChange={(e) => {
                                                                    const newEdu = [...profileData.education];
                                                                    newEdu[idx].school = e.target.value;
                                                                    setProfileData({ ...profileData, education: newEdu });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-bold"
                                                                placeholder="e.g. University of Lagos"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Degree</label>
                                                            <input
                                                                type="text"
                                                                value={edu.degree}
                                                                onChange={(e) => {
                                                                    const newEdu = [...profileData.education];
                                                                    newEdu[idx].degree = e.target.value;
                                                                    setProfileData({ ...profileData, education: newEdu });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                                                                placeholder="e.g. Bachelor of Science"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Field of Study</label>
                                                            <input
                                                                type="text"
                                                                value={edu.field}
                                                                onChange={(e) => {
                                                                    const newEdu = [...profileData.education];
                                                                    newEdu[idx].field = e.target.value;
                                                                    setProfileData({ ...profileData, education: newEdu });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                                                                placeholder="e.g. Computer Science"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Start Date</label>
                                                            <input
                                                                type="text"
                                                                value={edu.startDate}
                                                                onChange={(e) => {
                                                                    const newEdu = [...profileData.education];
                                                                    newEdu[idx].startDate = e.target.value;
                                                                    setProfileData({ ...profileData, education: newEdu });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                                                                placeholder="e.g. 2018"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">End Date</label>
                                                            <input
                                                                type="text"
                                                                value={edu.endDate}
                                                                onChange={(e) => {
                                                                    const newEdu = [...profileData.education];
                                                                    newEdu[idx].endDate = e.target.value;
                                                                    setProfileData({ ...profileData, education: newEdu });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                                                                placeholder="e.g. 2022"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <button
                                            onClick={() => {
                                                const newEdu: Education = {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    school: '',
                                                    degree: '',
                                                    field: '',
                                                    startDate: '',
                                                    endDate: '',
                                                    graduationDate: ''
                                                };
                                                setProfileData({ ...profileData, education: [newEdu, ...profileData.education] });
                                            }}
                                            className="w-full p-4 rounded-2xl border-2 border-dashed border-zinc-100 flex items-center justify-center gap-2 text-[13px] font-bold text-zinc-400 hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
                                        >
                                            <Plus size={16} className="group-hover:scale-110 transition-transform" />
                                            Add education
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Location & Work Authorization' && (
                            <motion.div
                                key="location-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12 py-4"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Current Residence</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            Where are you currently located?
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Country</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                <input
                                                    type="text"
                                                    value={profileData.country}
                                                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                    placeholder="e.g. Nigeria"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">City</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                <input
                                                    type="text"
                                                    value={profileData.city}
                                                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                    placeholder="e.g. Lagos"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-100 w-full" />

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Work Authorization</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            Your legal eligibility to work.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 space-y-6">
                                        <div className="space-y-4">
                                            {['Authorized to work', 'Requires sponsorship', 'Varies by company'].map((option) => (
                                                <label
                                                    key={option}
                                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${profileData.workAuthorization === option
                                                        ? 'border-blue-600 bg-blue-50/50'
                                                        : 'border-zinc-100 bg-white hover:border-zinc-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${profileData.workAuthorization === option ? 'border-blue-600' : 'border-zinc-200'}`}>
                                                            {profileData.workAuthorization === option && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                                        </div>
                                                        <span className="text-sm font-bold text-zinc-900">{option}</span>
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="workAuth"
                                                        className="hidden"
                                                        checked={profileData.workAuthorization === option}
                                                        onChange={() => setProfileData({ ...profileData, workAuthorization: option })}
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Work Preferences' && (
                            <motion.div
                                key="preferences-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12 py-4"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Role & Compensation</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            What are you looking for next?
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Target Compensation</label>
                                                <div className="relative">
                                                    <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={profileData.compensation}
                                                        onChange={(e) => setProfileData({ ...profileData, compensation: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                        placeholder="e.g. $100,000 / year"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Work Style</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                                                        <Clock size={16} />
                                                    </div>
                                                    <select
                                                        value={profileData.workStyle}
                                                        onChange={(e) => setProfileData({ ...profileData, workStyle: e.target.value })}
                                                        className="w-full pl-12 pr-10 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all text-sm font-bold text-zinc-900 cursor-pointer"
                                                    >
                                                        <option>Remote</option>
                                                        <option>Hybrid</option>
                                                        <option>In-person</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Availability' && (
                            <motion.div
                                key="availability-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12 py-4"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Work Availability</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            Tell us when you can start and your preferred working hours.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Timezone</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={profileData.timezone}
                                                        onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                        placeholder="e.g. GMT+1"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Weekly Hours</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={profileData.weeklyHours}
                                                        onChange={(e) => setProfileData({ ...profileData, weeklyHours: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                        placeholder="e.g. 40 hours"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Availability Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                <input
                                                    type="text"
                                                    value={profileData.availabilityDate}
                                                    onChange={(e) => setProfileData({ ...profileData, availabilityDate: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                    placeholder="e.g. Immediate"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Communications' && (
                            <motion.div
                                key="communications-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12 py-4"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 space-y-1">
                                        <h2 className="text-sm font-bold text-zinc-900">Notification Preferences</h2>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed">
                                            Control how you want to be notified about updates and opportunities.
                                        </p>
                                    </div>
                                    <div className="lg:col-span-8 space-y-4">
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white hover:border-blue-200 transition-all cursor-pointer">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-900">Email Notifications</p>
                                                <p className="text-xs text-zinc-500">Receive job matches and updates via email.</p>
                                            </div>
                                            <div
                                                onClick={() => setProfileData({ ...profileData, emailNotifications: !profileData.emailNotifications })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${profileData.emailNotifications ? 'bg-blue-600' : 'bg-zinc-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${profileData.emailNotifications ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </label>

                                        <label className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white hover:border-blue-200 transition-all cursor-pointer">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-900">Phone Alerts (SMS/WhatsApp)</p>
                                                <p className="text-xs text-zinc-500">Get instant alerts for high-priority interviews.</p>
                                            </div>
                                            <div
                                                onClick={() => setProfileData({ ...profileData, phoneAlerts: !profileData.phoneAlerts })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${profileData.phoneAlerts ? 'bg-blue-600' : 'bg-zinc-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${profileData.phoneAlerts ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </FadeIn>
    );
}
