'use client';

import React, { useState } from 'react';
import GlowIcon from '@/components/ui/GlowIcon';
import { CompanyLead } from '@/lib/leads-service';

interface LinkedInTemplateDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    lead: CompanyLead | null;
    vaName?: string;
    onLogOutreach?: (templateTitle: string, messageText: string) => void;
}

interface Template {
    id: string;
    title: string;
    tag: string;
    description: string;
    getSubject?: (lead: CompanyLead) => string;
    getBody: (lead: CompanyLead, vaName: string) => string;
}

const TEMPLATES: Template[] = [
    {
        id: 'conn_request',
        title: '1. Connection Request Note (<300 chars)',
        tag: 'Initial Request',
        description: 'Short personalized invite note for LinkedIn connection requests.',
        getBody: (lead, vaName) => {
            const firstName = lead.contactName ? lead.contactName.split(' ')[0] : 'there';
            const useCase = lead.dataSourcingNeeds?.[0] || 'data sourcing & labeling';
            return `Hi ${firstName}, noticed your work at ${lead.companyName}. We help high-growth teams source and structure custom datasets for ${useCase}. Would love to connect and share some insights!`;
        }
    },
    {
        id: 'post_connect_sample',
        title: '2. Post-Acceptance Sample Pitch',
        tag: 'Value Pitch',
        description: 'Send immediately once the connection request is accepted.',
        getBody: (lead, vaName) => {
            const firstName = lead.contactName ? lead.contactName.split(' ')[0] : 'there';
            const useCase = lead.dataSourcingNeeds?.join(' & ') || 'high-precision data extraction';
            return `Hi ${firstName}, thanks for connecting!\n\nSaw that ${lead.companyName} is innovating heavily in ${lead.industry || 'your space'}. My team at OnionLabel specializes in sourcing, cleaning, and labeling custom datasets (like ${useCase}) with a 24-48h turnaround.\n\nWe'd love to prepare a free 100-record sample dataset tailored for your exact pipeline so you can benchmark quality. Would that be helpful for your team this week?`;
        }
    },
    {
        id: 'expert_annotator_network',
        title: '3. Expert Human Labeling Pods (50% Cost Savings)',
        tag: 'Expert Network',
        description: 'Position OnionLabel’s African expert annotator network against expensive US vendors.',
        getBody: (lead, vaName) => {
            const firstName = lead.contactName ? lead.contactName.split(' ')[0] : 'there';
            const useCase = lead.dataSourcingNeeds?.[0] || 'RLHF & multimodal labeling';
            return `Hi ${firstName},\n\nMany AI teams we speak with find traditional data annotation vendors (charging $40–$60/hr) prohibitively expensive for scaling ${useCase}.\n\nAt OnionLabel, we operate managed pods of top-tier English-fluent STEM graduates, domain specialists, and clinical/legal annotators across Africa—delivering 99.2%+ accuracy at 50% lower unit costs.\n\nWe would love to do a free 100-record benchmark sample on your current dataset so your team can test our precision and speed with zero commitment. Would that be interesting?`;
        }
    },
    {
        id: 'followup_nudge',
        title: '4. Follow-Up #1 (3-4 Days After Message)',
        tag: 'Follow-Up',
        description: 'Gentle bump highlighting turnaround speed and accuracy guarantee.',
        getBody: (lead, vaName) => {
            const firstName = lead.contactName ? lead.contactName.split(' ')[0] : 'there';
            return `Hey ${firstName}, just floating this back up in case it got buried under your LinkedIn inbox.\n\nStill happy to build a quick free sample dataset for ${lead.companyName} to show how we handle ${lead.dataSourcingNeeds?.[0] || 'data sourcing'}.\n\nNo strings attached—let me know if you'd like me to pass the sample link over!`;
        }
    },
    {
        id: 'breakup_nurture',
        title: '5. Breakup / Nurture Touchpoint',
        tag: 'Final Follow-up',
        description: 'Polite final message keeping the door open for future data pipeline needs.',
        getBody: (lead, vaName) => {
            const firstName = lead.contactName ? lead.contactName.split(' ')[0] : 'there';
            return `Hi ${firstName}, I imagine data sourcing might not be a top priority for ${lead.companyName} right now. I won't crowd your inbox further!\n\nIf you ever need rapid custom web scraping, LLM data curation, or human annotation down the road, feel free to reach out anytime. Wishing you and the team all the best!`;
        }
    }
];

export default function LinkedInTemplateDrawer({
    isOpen,
    onClose,
    lead,
    vaName = 'Team',
    onLogOutreach
}: LinkedInTemplateDrawerProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
    const [customizedText, setCustomizedText] = useState<string>('');

    React.useEffect(() => {
        if (lead) {
            setCustomizedText(selectedTemplate.getBody(lead, vaName));
        }
    }, [lead, selectedTemplate, vaName]);

    if (!isOpen || !lead) return null;

    const handleCopy = (template: Template) => {
        navigator.clipboard.writeText(customizedText);
        setCopiedId(template.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopyAndLog = (template: Template) => {
        navigator.clipboard.writeText(customizedText);
        setCopiedId(template.id);
        if (onLogOutreach) {
            onLogOutreach(template.title, customizedText);
        }
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end transition-all">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200">
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center">
                            <GlowIcon name="message-square" size={16} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold">Outreach Messages</h2>
                            </div>
                            <p className="text-xs text-zinc-400">
                                Sourcing for <span className="text-white font-semibold">{lead.companyName}</span> • Contact: <span className="text-white font-semibold">{lead.contactName || 'Decision Maker'}</span> ({lead.contactRole || 'Role'})
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {lead.linkedinUrl && (
                            <a
                                href={lead.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold rounded-lg transition-colors shadow-xs"
                            >
                                <span>Open LinkedIn</span>
                                <GlowIcon name="external-link" size={12} />
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <GlowIcon name="xmark" size={18} />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Lead Context Pill Box */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-wrap gap-4 text-xs">
                        <div>
                            <span className="text-zinc-400 block font-medium">Industry</span>
                            <span className="font-semibold text-zinc-800">{lead.industry || 'Not specified'}</span>
                        </div>
                        <div>
                            <span className="text-zinc-400 block font-medium">Data Needs</span>
                            <span className="font-semibold text-zinc-800">{lead.dataSourcingNeeds?.join(', ') || 'Custom Datasets'}</span>
                        </div>
                        <div>
                            <span className="text-zinc-400 block font-medium">Est. Value</span>
                            <span className="font-semibold text-zinc-900">${(lead.estimatedValue || 0).toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-zinc-400 block font-medium">Assigned To</span>
                            <span className="font-semibold text-zinc-800">{lead.assignedVa || 'Unassigned'}</span>
                        </div>
                    </div>

                    {/* Template Picker */}
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-3">
                            Select Message Template
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {TEMPLATES.map((tmpl) => {
                                const isSelected = selectedTemplate.id === tmpl.id;
                                return (
                                    <button
                                        key={tmpl.id}
                                        onClick={() => {
                                            setSelectedTemplate(tmpl);
                                            setCustomizedText(tmpl.getBody(lead, vaName));
                                        }}
                                        className={`text-left p-3.5 rounded-xl border transition-all ${
                                            isSelected
                                                ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-950'
                                                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold truncate">{tmpl.title}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                                isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-500'
                                            }`}>
                                                {tmpl.tag}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                                            {tmpl.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Editable Message Preview */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                                <GlowIcon name="star" size={14} className="text-amber-500"  />
                                Personalized Message Preview (Ready to Paste)
                            </label>
                            <span className="text-xs font-medium text-zinc-400">
                                {customizedText.length} characters
                            </span>
                        </div>
                        <div className="relative">
                            <textarea
                                value={customizedText}
                                onChange={(e) => setCustomizedText(e.target.value)}
                                rows={8}
                                className="w-full p-4 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-sans text-zinc-900 bg-zinc-50/50 leading-relaxed resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-zinc-200 bg-zinc-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-zinc-500">
                        {lead.linkedinUrl ? (
                            <span>Paste directly into LinkedIn direct message / InMail.</span>
                        ) : (
                            <span className="text-amber-600">No LinkedIn URL added for this lead yet.</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => handleCopy(selectedTemplate)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xl transition-all shadow-sm"
                        >
                            {copiedId === selectedTemplate.id ? <GlowIcon name="checkmark" size={16} className="text-emerald-600"  /> : <GlowIcon name="copy" size={16}  />}
                            {copiedId === selectedTemplate.id ? 'Copied!' : 'Copy to Clipboard'}
                        </button>

                        <button
                            onClick={() => handleCopyAndLog(selectedTemplate)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20"
                        >
                            <GlowIcon name="paper-plane" size={15}  />
                            Copy & Log Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
