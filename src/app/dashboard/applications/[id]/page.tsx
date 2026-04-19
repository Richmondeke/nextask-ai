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
    Split,
    AlertCircle,
    Type,
    MapPin,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { db, auth as firebaseAuth } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const evaluationQuestions = [
    { title: 'Instruction Following', color: 'blue', response: 'A', q: 'How well did the model\'s response adhere to the prompt requirements?' },
    { title: 'Instruction Following', color: 'red', response: 'B', q: 'How well did the model\'s response adhere to the prompt requirements?' },
    { title: 'Truthfulness', color: 'blue', response: 'A', q: 'How truthful and accurate to the real world was the model\'s response? Is what it said actually true?' },
    { title: 'Truthfulness', color: 'red', response: 'B', q: 'How truthful and accurate to the real world was the model\'s response? Is what it said actually true?' },
    { title: 'Correctness', color: 'blue', response: 'A', q: 'Check if the model correctly identified all nuances and technical details.' },
    { title: 'Correctness', color: 'red', response: 'B', q: 'Check if the model correctly identified all nuances and technical details.' },
    { title: 'Writing Quality', color: 'blue', response: 'A', q: 'How clear, engaging, and professional is the writing style?' },
    { title: 'Writing Quality', color: 'red', response: 'B', q: 'How clear, engaging, and professional is the writing style?' },
    { title: 'Verbosity', color: 'blue', response: 'A', q: 'Is the response length appropriate for the prompt? (Too short, too long, or just right)' },
    { title: 'Verbosity', color: 'red', response: 'B', q: 'Is the response length appropriate for the prompt? (Too short, too long, or just right)' },
    { title: 'Overall quality', color: 'blue', response: 'A', q: 'Take everything into account and rate the overall quality of this response.' },
    { title: 'Overall quality', color: 'red', response: 'B', q: 'Take everything into account and rate the overall quality of this response.' },
    { title: 'Model Preference', type: 'preference', q: 'Please choose your preference between Response A and Response B. *' },
    { title: 'Rationale & Justification', type: 'justification', q: 'Justify your reasoning for choosing the winning model and scores above. *' },
];

const steps = [
    { id: 'location', label: 'Country Selection', icon: MapPin },
    { id: 'phone', label: 'Phone Verification', icon: Smartphone },
    { id: 'resume', label: 'Upload Resume', icon: FileText },
    { id: 'auth', label: 'Work Authorization', icon: ShieldCheck },
    { id: 'interview', label: 'Domain Expert Interview', icon: Monitor, badge: 'CORE' },
    { id: 'evaluation', label: 'Model Response Evaluation (MRN)', icon: ClipboardList },
];

export default function ApplicationAssessmentPage() {
    const params = useParams();
    const router = useRouter();
    const applicationId = params?.id as string;

    const [currentStepIndex, setCurrentStepIndex] = useState(0); // Default to first step
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        phone: '',
        verificationMethod: 'SMS',
        resumeName: 'Resume_RICHMOND_EKE.pdf',
        resumeUrl: '',
        fullName: 'Richmond Eke',
        email: '',
        linkedin: 'linkedin.com/in/richmond-eke',
        residence: {
            country: 'Nigeria',
            state: '',
            city: '',
            postalCode: ''
        },
        legalAuthorizations: {
            authorized: false,
            noSponsorship: false,
            accurateInformation: false
        },
        responses: Array(evaluationQuestions.length).fill(0),
        evaluations: {}
    });

    const currentStep = steps[currentStepIndex];

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setFormData((prev: any) => ({ ...prev, email: currentUser.email || '' }));

                // Fetch existing submission
                if (applicationId) {
                    try {
                        const docRef = doc(db, 'submissions', `${currentUser.uid}_${applicationId}`);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            setFormData((prev: any) => ({ ...prev, ...data }));
                            if (data.currentStepIndex) setCurrentStepIndex(data.currentStepIndex);
                            if (data.currentQuestionIndex) setCurrentQuestionIndex(data.currentQuestionIndex);
                        }
                    } catch (error) {
                        console.error("Error fetching submission:", error);
                    }
                }
            } else {
                router.push('/login');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [applicationId, router]);

    const saveProgress = async (nextStepIdx: number, nextQuestionIdx: number) => {
        if (!user || !applicationId) return;

        try {
            const docRef = doc(db, 'submissions', `${user.uid}_${applicationId}`);
            await setDoc(docRef, {
                ...formData,
                currentStepIndex: nextStepIdx,
                currentQuestionIndex: nextQuestionIdx,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };

    const isEvaluationStep = currentStep.id === 'evaluation';
    const totalEvaluationQuestions = evaluationQuestions.length;

    const progress = isEvaluationStep
        ? Math.round(((currentStepIndex + (currentQuestionIndex / totalEvaluationQuestions)) / steps.length) * 100)
        : Math.round((currentStepIndex / (steps.length - 1)) * 100);

    const handleNext = async () => {
        let nextStepIdx = currentStepIndex;
        let nextQuestionIdx = currentQuestionIndex;

        if (isEvaluationStep) {
            if (currentQuestionIndex < totalEvaluationQuestions - 1) {
                nextQuestionIdx = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextQuestionIdx);
            } else {
                alert('Application submitted successfully!');
                router.push('/dashboard');
                return;
            }
        } else if (currentStepIndex < steps.length - 1) {
            nextStepIdx = currentStepIndex + 1;
            setCurrentStepIndex(nextStepIdx);
        }

        await saveProgress(nextStepIdx, nextQuestionIdx);
    };

    const handleBack = async () => {
        let nextStepIdx = currentStepIndex;
        let nextQuestionIdx = currentQuestionIndex;

        if (currentStep.id === 'evaluation' && currentQuestionIndex > 0) {
            nextQuestionIdx = currentQuestionIndex - 1;
            setCurrentQuestionIndex(nextQuestionIdx);
        } else if (currentStepIndex > 0) {
            nextStepIdx = currentStepIndex - 1;
            setCurrentStepIndex(nextStepIdx);
        }

        await saveProgress(nextStepIdx, nextQuestionIdx);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-[200]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-zinc-500">Loading assessment...</p>
                </div>
            </div>
        );
    }

    const renderStepContent = () => {
        switch (currentStep.id) {
            case 'location':
                return (
                    <div className="max-w-xl mx-auto space-y-10 py-10">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-900">Where are you based?</h2>
                            <p className="text-sm text-zinc-500 font-medium">Please select your country of residence to continue.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Select Country</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {['Nigeria', 'Ghana', 'Kenya'].map((country) => (
                                        <button
                                            key={country}
                                            onClick={() => setFormData({ ...formData, residence: { ...formData.residence, country } })}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${formData.residence.country === country
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                                : 'border-zinc-100 bg-white hover:border-zinc-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${formData.residence.country === country ? 'bg-blue-100' : 'bg-zinc-50'
                                                    }`}>
                                                    {country === 'Nigeria' ? '🇳🇬' : country === 'Ghana' ? '🇬🇭' : '🇰🇪'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900">{country}</p>
                                                    <p className="text-xs text-zinc-400 font-medium">Available for expert registration</p>
                                                </div>
                                            </div>
                                            {formData.residence.country === country && (
                                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                    <CheckCircle2 size={14} strokeWidth={3} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="text-[10px] text-zinc-400 bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex items-center gap-2">
                                <AlertCircle size={14} className="text-zinc-500" />
                                We currently only support registration from Nigeria, Ghana, and Kenya.
                            </p>
                        </div>
                    </div>
                );
            case 'phone':
                return (
                    <div className="max-w-xl mx-auto space-y-10 py-10">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-900">Phone Verification</h2>
                            <p className="text-sm text-zinc-500 font-medium">Please verify your phone number to continue with your application.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Phone number *</label>
                                <div className="flex gap-2">
                                    <div className="w-24 relative">
                                        <div className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white flex items-center gap-2 cursor-pointer">
                                            <span className="text-[13px] font-bold text-zinc-900">+234</span>
                                            <ChevronDown size={14} className="text-zinc-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Mobile number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="flex-1 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Verification method *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex items-center justify-between px-5 py-4 rounded-xl border ${formData.verificationMethod === 'SMS' ? 'border-blue-600 bg-blue-50/10' : 'border-zinc-200'} cursor-pointer hover:bg-zinc-50 transition-all`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 ${formData.verificationMethod === 'SMS' ? 'border-blue-600' : 'border-zinc-200'} flex items-center justify-center p-1`}>
                                                {formData.verificationMethod === 'SMS' && <div className="w-full h-full bg-blue-600 rounded-full" />}
                                            </div>
                                            <span className={`text-sm font-bold ${formData.verificationMethod === 'SMS' ? 'text-zinc-900' : 'text-zinc-500'}`}>SMS</span>
                                        </div>
                                        <input
                                            type="radio"
                                            name="method"
                                            className="hidden"
                                            checked={formData.verificationMethod === 'SMS'}
                                            onChange={() => setFormData({ ...formData, verificationMethod: 'SMS' })}
                                        />
                                    </label>
                                    <label className={`flex items-center justify-between px-5 py-4 rounded-xl border ${formData.verificationMethod === 'WHATSAPP' ? 'border-blue-600 bg-blue-50/10' : 'border-zinc-200'} cursor-pointer hover:bg-zinc-50 transition-all`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 ${formData.verificationMethod === 'WHATSAPP' ? 'border-blue-600' : 'border-zinc-200'} flex items-center justify-center p-1`}>
                                                {formData.verificationMethod === 'WHATSAPP' && <div className="w-full h-full bg-blue-600 rounded-full" />}
                                            </div>
                                            <span className={`text-sm font-bold ${formData.verificationMethod === 'WHATSAPP' ? 'text-zinc-900' : 'text-zinc-500'}`}>WhatsApp</span>
                                        </div>
                                        <input
                                            type="radio"
                                            name="method"
                                            className="hidden"
                                            checked={formData.verificationMethod === 'WHATSAPP'}
                                            onChange={() => setFormData({ ...formData, verificationMethod: 'WHATSAPP' })}
                                        />
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full h-12 bg-blue-600 rounded-xl text-white text-[13px] font-black transition-all hover:bg-blue-700 shadow-md shadow-blue-100"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                );
            case 'resume':
                return (
                    <div className="max-w-2xl mx-auto space-y-10 py-10">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold text-zinc-900">Upload Resume</h2>
                            <p className="text-sm text-zinc-500 font-medium">Keep your profile up to date for better opportunities.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="p-8 rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50/50 flex flex-col items-center justify-center gap-4 group hover:border-blue-200 transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                                    <FileText className="text-blue-600" size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-zinc-900">{formData.resumeName || 'Upload Resume'}</p>
                                    <p className="text-[11px] font-medium text-zinc-400">PDF or DOCX max 10MB</p>
                                </div>
                                {formData.resumeName && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                                        <CheckCircle2 size={12} className="text-green-600 fill-green-600 text-white" />
                                        <span className="text-[10px] font-bold text-green-700">Successfully Uploaded</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Full name *</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Email address *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 text-[13px] font-bold cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Phone number *</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600 pr-10"
                                        />
                                        <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">LinkedIn URL *</label>
                                    <input
                                        type="text"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'auth':
                return (
                    <div className="max-w-2xl mx-auto space-y-10 py-10">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-900">Work Authorization</h2>
                            <p className="text-sm text-zinc-500 font-medium">Please provide your work authorization details for eligibility verification.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-600" />
                                    Location of Residence
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Country *</label>
                                        <input
                                            type="text"
                                            value={formData.residence.country}
                                            onChange={(e) => setFormData({ ...formData, residence: { ...formData.residence, country: e.target.value } })}
                                            placeholder="e.g. United States"
                                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">State / Province</label>
                                        <input
                                            type="text"
                                            value={formData.residence.state}
                                            onChange={(e) => setFormData({ ...formData, residence: { ...formData.residence, state: e.target.value } })}
                                            placeholder="e.g. California"
                                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">City *</label>
                                        <input
                                            type="text"
                                            value={formData.residence.city}
                                            onChange={(e) => setFormData({ ...formData, residence: { ...formData.residence, city: e.target.value } })}
                                            placeholder="e.g. San Francisco"
                                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Postal Code *</label>
                                        <input
                                            type="text"
                                            value={formData.residence.postalCode}
                                            onChange={(e) => setFormData({ ...formData, residence: { ...formData.residence, postalCode: e.target.value } })}
                                            placeholder="e.g. 94103"
                                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-blue-600" />
                                    Legal Authorization
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex gap-3 p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalAuthorizations.authorized}
                                            onChange={(e) => setFormData({ ...formData, legalAuthorizations: { ...formData.legalAuthorizations, authorized: e.target.checked } })}
                                            className="mt-1 accent-blue-600"
                                        />
                                        <span className="text-sm font-medium text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">
                                            I am legally authorized to work in my country of residence.
                                        </span>
                                    </label>
                                    <label className="flex gap-3 p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalAuthorizations.noSponsorship}
                                            onChange={(e) => setFormData({ ...formData, legalAuthorizations: { ...formData.legalAuthorizations, noSponsorship: e.target.checked } })}
                                            className="mt-1 accent-blue-600"
                                        />
                                        <span className="text-sm font-medium text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">
                                            I will not require visa sponsorship at any point in the future.
                                        </span>
                                    </label>
                                    <label className="flex gap-3 p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.legalAuthorizations.accurateInformation}
                                            onChange={(e) => setFormData({ ...formData, legalAuthorizations: { ...formData.legalAuthorizations, accurateInformation: e.target.checked } })}
                                            className="mt-1 accent-blue-600"
                                        />
                                        <span className="text-sm font-medium text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">
                                            I confirm all information provided is true and accurate.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                    <Type size={16} className="text-blue-600" />
                                    Digital Signature
                                </h3>
                                <div className="p-8 rounded-2xl border border-zinc-200 bg-white space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Full Legal Name *</label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Type your full legal name"
                                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Signature *</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    readOnly
                                                    placeholder="Type name to sign"
                                                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/30 text-zinc-900 text-lg font-['Dancing_Script',_cursive] focus:outline-none focus:border-blue-600"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300">Digital Signature</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Date *</label>
                                            <input
                                                type="text"
                                                value={new Date().toLocaleDateString()}
                                                readOnly
                                                className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/30 text-zinc-900 text-[13px] font-bold focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <input type="date" className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-bold focus:outline-none focus:border-blue-600" />
                            </div>
                        </div>
                    </div>
                );
            case 'interview':
                return (
                    <div className="max-w-2xl mx-auto space-y-10 py-10 flex flex-col items-center justify-center min-h-[500px]">
                        <div className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                            <Monitor className="text-blue-600" size={48} strokeWidth={1.5} />
                        </div>
                        <div className="text-center space-y-4 max-w-sm">
                            <h2 className="text-3xl font-bold text-zinc-900">Domain Expert Interview</h2>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                                You've reached the core of our assessment. We'll be matching you with a domain expert for a deeper technical discussion.
                            </p>
                            <div className="pt-6">
                                <button className="px-10 py-4 bg-zinc-900 text-white rounded-2xl text-[13px] font-black transition-all hover:bg-zinc-800 shadow-xl shadow-zinc-200 flex items-center gap-3">
                                    Schedule Interview
                                    <ChevronRight size={18} strokeWidth={3} />
                                </button>
                                <p className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Typical duration: 45 minutes</p>
                            </div>
                        </div>
                    </div>
                );
            case 'evaluation':
                const currentEvalQ = evaluationQuestions[currentQuestionIndex];
                return (
                    <div className="max-w-4xl mx-auto space-y-10">
                        <section className="space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-900">Model Response Evaluation (MRN)</h2>
                        </section>

                        <section className="space-y-4 select-none">
                            <h3 className="text-lg font-bold text-blue-600">Assessment</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Prompt</h4>
                                    <div className="h-px flex-1 bg-blue-100" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-900 leading-relaxed bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                                    Prompt: Explain how important Catherine the Great's personal participation in Russia's smallpox vaccine launch was to convincing her people to be vaccinated.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-6 select-none">
                            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Model Responses</h3>

                            <div className="flex border border-zinc-100 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                                {/* Response A */}
                                <div className="flex-1 border-r border-zinc-100 flex flex-col bg-white overflow-y-auto custom-scrollbar">
                                    <div className="sticky top-0 px-6 py-4 bg-blue-50/50 text-blue-700 text-[10px] font-black tracking-widest uppercase border-b border-zinc-100 flex items-center justify-between backdrop-blur-sm">
                                        Response A
                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    </div>
                                    <div className="p-8 text-[13px] leading-relaxed text-zinc-800 space-y-6">
                                        <p>It was decisive — without Catherine rolling up her own sleeve, Russia probably wouldn't have had a mass inoculation campaign at all. (And yes, historians get pedantic here: what she promoted in 1768 was **variolation/inoculation**, not Jenner's cowpox *vaccine* of 1796 — the idea of deliberately giving someone a mild case of smallpox using matter from a human pustule. The principle, and the public-relations problem, were the same.)</p>

                                        <div className="space-y-4 pt-4">
                                            <h4 className="font-bold text-zinc-900 border-l-2 border-blue-600 pl-3">1. Why Russians were terrified of it</h4>
                                            <ul className="list-disc pl-8 space-y-3">
                                                <li>**Smallpox was a national trauma.** In the 1760s it killed 10% of those infected and left many more blind or scarred; earlier tsars (Peter II in 1730) had died of it.</li>
                                                <li>**Inoculation looked insane.** You were intentionally giving a healthy person of the "heaven-sent" disease.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* Response B */}
                                <div className="flex-1 flex flex-col bg-slate-50/30 overflow-y-auto custom-scrollbar">
                                    <div className="sticky top-0 px-6 py-4 bg-red-50/50 text-red-700 text-[10px] font-black tracking-widest uppercase border-b border-zinc-100 flex items-center justify-between backdrop-blur-sm">
                                        Response B
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                    </div>
                                    <div className="p-8 text-[13px] leading-relaxed text-zinc-800 space-y-6">
                                        <p>Catherine the Great's personal participation in introducing smallpox immunization to Russia was not just important—it was the **single most crucial factor** in the success of the campaign. Without her leading by example, it is highly unlikely the practice would have gained traction among the Russian people.</p>
                                        <p>To understand the magnitude of her actions, it helps to look at the historical context, the profound risks she took, and the brilliant public relations strategy she built around her survival.</p>
                                        <p className="text-zinc-500 italic bg-zinc-50/50 p-4 rounded-xl border border-zinc-100/50">(Note: The procedure Catherine underwent in 1768 was called variolation or inoculation, which involved deliberately infecting a patient with a mild strain of live human smallpox. Edward Jenner's safer cowpox-based "vaccine" was not invented until 1796. However, the intent and public health impact were the same.)</p>

                                        <p className="pt-2">Here is an explanation of why her personal participation was so vital:</p>

                                        <div className="space-y-4 pt-2">
                                            <h4 className="font-bold text-zinc-900 border-l-2 border-red-600 pl-3">1. Overcoming Intense Fear and Superstition</h4>
                                            <p className="text-zinc-600 pl-3">In 18th-century Russia, smallpox was a terrifying, indiscriminate killer. It wiped out entire villages and killed an estimated 1 in 7 children born locally.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8 pb-32">
                            <div className="flex items-center gap-3 py-4">
                                <div className="h-px flex-1 bg-zinc-100" />
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Evaluation Dimension {currentQuestionIndex + 1} of 14</span>
                                <div className="h-px flex-1 bg-zinc-100" />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestionIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-8 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl border border-zinc-200 bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-lg shadow-blue-100">
                                        {currentQuestionIndex + 1}
                                    </div>
                                    <div className="space-y-6 w-full pt-1">
                                        {currentEvalQ.type === 'preference' ? (
                                            <div className="space-y-6">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-lg text-zinc-900">
                                                        {currentEvalQ.q}
                                                    </h3>
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                                                        Preference Scale (1-7)
                                                    </p>
                                                    <p className="text-[13px] italic text-zinc-500 font-medium leading-relaxed max-w-2xl mt-1">
                                                        Choose between Strongly Prefer Model A (1) and Strongly Prefer Model B (7). 4 would represent a tie.
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                                        <button
                                                            key={num}
                                                            onClick={() => {
                                                                const newResponses = [...formData.responses];
                                                                newResponses[currentQuestionIndex] = num;
                                                                setFormData({ ...formData, responses: newResponses });
                                                            }}
                                                            className={`h-14 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all group/btn ${formData.responses[currentQuestionIndex] === num
                                                                ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100/50'
                                                                : 'border-zinc-200 hover:border-blue-600 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            <span className={`text-sm font-bold ${formData.responses[currentQuestionIndex] === num ? 'text-blue-600' : 'text-zinc-900'}`}>{num}</span>
                                                            <span className={`text-[8px] font-black uppercase tracking-tighter ${formData.responses[currentQuestionIndex] === num ? 'text-blue-600' : 'text-zinc-400 group-hover/btn:text-blue-600'
                                                                }`}>
                                                                {num === 1 ? 'Pref A' : num === 4 ? 'Tie' : num === 7 ? 'Pref B' : ''}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : currentEvalQ.type === 'justification' ? (
                                            <div className="space-y-6">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-lg text-zinc-900">
                                                        {currentEvalQ.q}
                                                    </h3>
                                                    <div className="text-[13px] italic text-zinc-500 font-medium leading-relaxed max-w-2xl bg-zinc-50 p-6 rounded-2xl border border-zinc-100 mt-4">
                                                        Cite specific evidence, truthfulness issues, and your personal reasoning. Reference all 6 dimensions: Instruction Following, Truthfulness, Correctness, Writing Quality, Verbosity, and Overall Quality.
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <textarea
                                                        placeholder="Type your justification here..."
                                                        className="w-full h-64 px-8 py-8 rounded-3xl border border-zinc-200 bg-white text-zinc-900 text-[13px] font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all resize-none placeholder:text-zinc-300 shadow-sm"
                                                    />
                                                    <div className="flex justify-end pt-3">
                                                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">0 / 50,000 characters</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                                        <span className={currentEvalQ.color === 'blue' ? 'text-blue-600' : 'text-red-600'}>
                                                            Response {currentEvalQ.response}
                                                        </span>
                                                        <span className="text-zinc-300">—</span>
                                                        <span className="text-zinc-900 tracking-tight">{currentEvalQ.title} *</span>
                                                    </h3>
                                                    <p className="text-[13px] text-zinc-500 font-medium leading-relaxed max-w-2xl">
                                                        {currentEvalQ.q}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-5 gap-3">
                                                    {[1, 2, 3, 4, 5].map(num => (
                                                        <button
                                                            key={num}
                                                            onClick={() => {
                                                                const newResponses = [...formData.responses];
                                                                newResponses[currentQuestionIndex] = num;
                                                                setFormData({ ...formData, responses: newResponses });
                                                            }}
                                                            className={`h-14 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all group/btn ${formData.responses[currentQuestionIndex] === num
                                                                ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100/50'
                                                                : 'border-zinc-200 hover:border-blue-600 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            <span className={`text-sm font-bold ${formData.responses[currentQuestionIndex] === num ? 'text-blue-600' : 'text-zinc-900'}`}>{num}</span>
                                                            <span className={`text-[8px] font-black uppercase tracking-tighter ${formData.responses[currentQuestionIndex] === num ? 'text-blue-600' : 'text-zinc-400 group-hover/btn:text-blue-600'
                                                                }`}>
                                                                {num === 1 ? 'Poor' : num === 3 ? 'Good' : num === 5 ? 'Excellent' : ''}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </section>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex flex-col z-[100]">
            {/* Top Navigation */}
            <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-xl border border-zinc-200 text-zinc-900 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm">
                        <ChevronLeft size={16} strokeWidth={3} />
                        Go back
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-300 text-xs font-bold">Dashboard</span>
                        <ChevronRight size={12} className="text-zinc-300" strokeWidth={3} />
                        <span className="text-zinc-500 text-xs font-bold">Applications</span>
                        <ChevronRight size={12} className="text-zinc-300" strokeWidth={3} />
                        <span className="text-zinc-900 text-xs font-bold">Expert Application</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-xl text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-zinc-900 transition-all">
                        FAQ
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
                        Support
                    </button>
                    <div className="h-8 w-px bg-zinc-100 mx-2" />
                    <button className="w-10 h-10 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400">
                        <Monitor size={18} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-80 border-r border-zinc-100 p-8 flex flex-col shrink-0 overflow-y-auto bg-white custom-scrollbar">
                    <div className="space-y-5 mb-10">
                        <Logo />
                        <h1 className="text-2xl font-bold text-zinc-900 leading-tight tracking-tight mt-6">Expert Assessment</h1>
                        <div className="space-y-2.5 pt-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{currentStepIndex + 1} of {steps.length} steps</span>
                                <span className="text-[13px] font-black text-blue-600">{progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                                />
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {steps.map((step, idx) => {
                            const isCompleted = idx < currentStepIndex;
                            const isActive = idx === currentStepIndex;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStepIndex(idx)}
                                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border transition-all duration-300 text-left group ${isActive
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]'
                                        : isCompleted
                                            ? 'bg-white border-zinc-100 text-zinc-900 hover:border-zinc-200'
                                            : 'border-transparent text-zinc-400 hover:bg-zinc-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isActive
                                            ? 'bg-blue-500'
                                            : isCompleted
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-600'}`}>
                                            <step.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[13px] font-black tracking-tight ${isActive ? 'text-white' : 'text-zinc-900'}`}>
                                                {step.label}
                                            </span>
                                            {step.badge && (
                                                <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${isActive ? 'text-blue-100' : 'text-zinc-400'}`}>
                                                    {step.badge} PHASE
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {isCompleted ? (
                                        <CheckCircle2 size={16} className={`fill-current ${isActive ? 'text-white' : 'text-blue-600'}`} strokeWidth={3} />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-white' : 'bg-zinc-200 group-hover:bg-zinc-300'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-10">
                        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                                <HelpCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-zinc-900">Need assistance?</h4>
                                <p className="text-[11px] text-zinc-500 mt-1 font-medium leading-relaxed">Our recruitment team is available 24/7 to help you with the process.</p>
                            </div>
                            <button className="w-full py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all">
                                Chat with Support
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-white p-12 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="min-h-full"
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Footer Navigation */}
            <footer className="h-24 border-t border-zinc-100 bg-white flex flex-col shrink-0 px-10 relative z-50">
                <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    />
                </div>

                <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            disabled={currentStepIndex === 0}
                            className={`px-6 py-3 rounded-2xl border transition-all font-black text-[11px] uppercase tracking-widest flex items-center gap-2 ${currentStepIndex === 0
                                ? 'border-zinc-100 text-zinc-300 cursor-not-allowed'
                                : 'border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                                }`}
                        >
                            <ChevronLeft size={16} strokeWidth={3} />
                            Back
                        </button>
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest px-4 whitespace-nowrap">
                            {isEvaluationStep
                                ? `Question ${currentQuestionIndex + 1} of ${totalEvaluationQuestions}`
                                : `Step ${currentStepIndex + 1} of ${steps.length}`
                            }
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-zinc-50 rounded-2xl p-1 shadow-inner border border-zinc-100 max-w-[400px] overflow-x-auto no-scrollbar">
                            {isEvaluationStep ? (
                                Array.from({ length: totalEvaluationQuestions }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={`min-w-[32px] h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all mx-0.5 ${idx === currentQuestionIndex
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : idx < currentQuestionIndex
                                                ? 'text-blue-600 hover:bg-white'
                                                : 'text-zinc-400 hover:bg-white'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))
                            ) : (
                                steps.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentStepIndex(idx)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${idx === currentStepIndex
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : idx < currentStepIndex
                                                ? 'text-blue-600 hover:bg-white'
                                                : 'text-zinc-400 hover:bg-white'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))
                            )}
                        </div>
                        <div className="h-10 w-px bg-zinc-100" />
                        <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 bg-zinc-50 hover:bg-white transition-all">
                            <Split size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2 group"
                    >
                        Next
                        <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </footer>

            <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                    
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 5px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #f4f4f5;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #e4e4e7;
                    }
                `}</style>
        </div>
    );
}
