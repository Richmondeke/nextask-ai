'use client';

import React, { useState, useEffect } from 'react';
import GlowIcon from '@/components/ui/GlowIcon';
import {
    CompanyLead,
    LeadStage,
    LeadPriority,
    STAGES,
    INDUSTRIES,
    DATA_NEEDS_OPTIONS
} from '@/lib/leads-service';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (leadData: Omit<CompanyLead, 'id'> | Partial<CompanyLead>) => Promise<void>;
    leadToEdit?: CompanyLead | null;
    currentVaName?: string;
}

export default function LeadModal({
    isOpen,
    onClose,
    onSave,
    leadToEdit,
    currentVaName = 'Alex (VA)'
}: LeadModalProps) {
    const [companyName, setCompanyName] = useState('');
    const [website, setWebsite] = useState('');
    const [industry, setIndustry] = useState(INDUSTRIES[0]);
    const [companySize, setCompanySize] = useState('11-50 employees');
    const [dataSourcingNeeds, setDataSourcingNeeds] = useState<string[]>([]);
    const [estimatedValue, setEstimatedValue] = useState<number>(3000);
    const [priority, setPriority] = useState<LeadPriority>('medium');
    const [stage, setStage] = useState<LeadStage>('sourced');

    // Decision Maker
    const [contactName, setContactName] = useState('');
    const [contactRole, setContactRole] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    // Follow-up
    const [assignedVa, setAssignedVa] = useState(currentVaName);
    const [nextFollowUpDate, setNextFollowUpDate] = useState('');
    const [linkedinStatus, setLinkedinStatus] = useState<any>('not_contacted');

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (leadToEdit) {
            setCompanyName(leadToEdit.companyName || '');
            setWebsite(leadToEdit.website || '');
            setIndustry(leadToEdit.industry || INDUSTRIES[0]);
            setCompanySize(leadToEdit.companySize || '11-50 employees');
            setDataSourcingNeeds(leadToEdit.dataSourcingNeeds || []);
            setEstimatedValue(leadToEdit.estimatedValue || 0);
            setPriority(leadToEdit.priority || 'medium');
            setStage(leadToEdit.stage || 'sourced');
            setContactName(leadToEdit.contactName || '');
            setContactRole(leadToEdit.contactRole || '');
            setLinkedinUrl(leadToEdit.linkedinUrl || '');
            setContactEmail(leadToEdit.contactEmail || '');
            setContactPhone(leadToEdit.contactPhone || '');
            setAssignedVa(leadToEdit.assignedVa || currentVaName);
            setNextFollowUpDate(leadToEdit.nextFollowUpDate || '');
            setLinkedinStatus(leadToEdit.linkedinStatus || 'not_contacted');
        } else {
            // Reset for fresh lead
            setCompanyName('');
            setWebsite('');
            setIndustry(INDUSTRIES[0]);
            setCompanySize('11-50 employees');
            setDataSourcingNeeds([DATA_NEEDS_OPTIONS[0]]);
            setEstimatedValue(3500);
            setPriority('medium');
            setStage('sourced');
            setContactName('');
            setContactRole('');
            setLinkedinUrl('');
            setContactEmail('');
            setContactPhone('');
            setAssignedVa(currentVaName);
            setNextFollowUpDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
            setLinkedinStatus('not_contacted');
        }
        setError('');
    }, [leadToEdit, isOpen, currentVaName]);

    if (!isOpen) return null;

    const toggleDataNeed = (option: string) => {
        if (dataSourcingNeeds.includes(option)) {
            setDataSourcingNeeds(dataSourcingNeeds.filter((d) => d !== option));
        } else {
            setDataSourcingNeeds([...dataSourcingNeeds, option]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName.trim()) {
            setError('Company Name is required.');
            return;
        }

        try {
            setIsSaving(true);
            setError('');

            const payload: any = {
                companyName: companyName.trim(),
                website: website.trim(),
                industry,
                companySize,
                dataSourcingNeeds,
                estimatedValue: Number(estimatedValue) || 0,
                priority,
                stage,
                contactName: contactName.trim(),
                contactRole: contactRole.trim(),
                linkedinUrl: linkedinUrl.trim(),
                contactEmail: contactEmail.trim(),
                contactPhone: contactPhone.trim(),
                assignedVa: assignedVa.trim(),
                nextFollowUpDate: nextFollowUpDate || undefined,
                linkedinStatus
            };

            await onSave(payload);
            onClose();
        } catch (err: any) {
            console.error('Error saving lead:', err);
            setError(err.message || 'Failed to save lead.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold">
                            <GlowIcon name="layers" size={20}  />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900">
                                {leadToEdit ? 'Edit Company Lead' : 'Track New Data Sourcing Lead'}
                            </h2>
                            <p className="text-xs text-zinc-500">
                                Add prospective client company details, decision maker LinkedIn, and follow-up timeline.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 rounded-xl transition-colors"
                    >
                        <GlowIcon name="xmark" size={20}  />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                            <GlowIcon name="alert-circle" size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Section 1: Company Overview */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <GlowIcon name="layers" size={14}  /> 1. Company Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. OpenAI, Anthropic, Waymo"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Company Website
                                </label>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Industry Vertical
                                </label>
                                <select
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    {INDUSTRIES.map((ind) => (
                                        <option key={ind} value={ind}>{ind}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Company Size
                                </label>
                                <select
                                    value={companySize}
                                    onChange={(e) => setCompanySize(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="1-10 employees">1-10 employees (Early Seed)</option>
                                    <option value="11-50 employees">11-50 employees (Series A)</option>
                                    <option value="51-200 employees">51-200 employees (Scaleup)</option>
                                    <option value="201-500 employees">201-500 employees (Growth)</option>
                                    <option value="500+ employees">500+ employees (Enterprise)</option>
                                </select>
                            </div>
                        </div>

                        {/* Data Sourcing Needs Selection */}
                        <div>
                            <label className="text-xs font-bold text-zinc-700 block mb-2">
                                Data Sourcing & Labeling Requirements
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {DATA_NEEDS_OPTIONS.map((opt) => {
                                    const selected = dataSourcingNeeds.includes(opt);
                                    return (
                                        <button
                                            type="button"
                                            key={opt}
                                            onClick={() => toggleDataNeed(opt)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                                                selected
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                            }`}
                                        >
                                            {selected ? '✓ ' : '+ '}{opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 pt-4 space-y-4">
                        {/* Section 2: Decision Maker (LinkedIn) */}
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <GlowIcon name="user" size={14}  /> 2. Target Decision Maker
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    placeholder="e.g. Alex Morgan"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Title / Role
                                </label>
                                <input
                                    type="text"
                                    value={contactRole}
                                    onChange={(e) => setContactRole(e.target.value)}
                                    placeholder="e.g. Head of AI / VP Data / Founder"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    LinkedIn Profile URL
                                </label>
                                <input
                                    type="url"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    placeholder="https://www.linkedin.com/in/username"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-zinc-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Email Address (Optional)
                                </label>
                                <input
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    LinkedIn Outreach Status
                                </label>
                                <select
                                    value={linkedinStatus}
                                    onChange={(e) => setLinkedinStatus(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="not_contacted">Not Contacted</option>
                                    <option value="request_sent">Connection Request Sent</option>
                                    <option value="connected">Connected on LinkedIn</option>
                                    <option value="inmail_sent">InMail Sent</option>
                                    <option value="replied">Replied / In Conversation</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 pt-4 space-y-4">
                        {/* Section 3: Deal & Pipeline Tracking */}
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <GlowIcon name="percent" size={14} /> 3. Pipeline & Assignment
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Pipeline Stage
                                </label>
                                <select
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value as LeadStage)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-zinc-500 outline-none bg-white"
                                >
                                    {STAGES.map((st) => (
                                        <option key={st.id} value={st.id}>{st.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Priority Level
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as LeadPriority)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-zinc-500 outline-none bg-white"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Est. Value ($)
                                </label>
                                <input
                                    type="number"
                                    value={estimatedValue}
                                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                                    placeholder="3500"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-zinc-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Assigned To
                                </label>
                                <input
                                    type="text"
                                    value={assignedVa}
                                    onChange={(e) => setAssignedVa(e.target.value)}
                                    placeholder="e.g. Alex / Maria"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:border-zinc-500 outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs font-bold text-zinc-700 block mb-1">
                                    Next Action / Follow-up Date
                                </label>
                                <input
                                    type="date"
                                    value={nextFollowUpDate}
                                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-semibold hover:bg-zinc-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold shadow-lg shadow-zinc-900/10 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : leadToEdit ? 'Update Lead' : 'Create & Track Lead'}
                    </button>
                </div>
            </div>
        </div>
    );
}
