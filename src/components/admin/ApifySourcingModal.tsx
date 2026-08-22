'use client';

import React, { useState } from 'react';
import GlowIcon from '@/components/ui/GlowIcon';
import { CompanyLead } from '@/lib/leads-service';

interface ApifySourcingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLeadsImported: (leads: CompanyLead[]) => void;
}

export default function ApifySourcingModal({
    isOpen,
    onClose,
    onLeadsImported
}: ApifySourcingModalProps) {
    const [apiKey, setApiKey] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('onionlabel_apify_key') || '';
        }
        return '';
    });
    const [category, setCategory] = useState('rlhf');
    const [count, setCount] = useState(25);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [approvalUrl, setApprovalUrl] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleRunSourcing = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            setError('Please enter your Apify API Token.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            setApprovalUrl(null);
            setSuccessMessage('');

            // Save key to local storage for convenience
            localStorage.setItem('onionlabel_apify_key', apiKey.trim());

            const res = await fetch('/api/apify/source-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: apiKey.trim(),
                    category,
                    count: Number(count)
                })
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.approvalUrl) {
                    setApprovalUrl(data.approvalUrl);
                }
                throw new Error(data.error || 'Failed to fetch leads from Apify.');
            }

            if (data.leads && data.leads.length > 0) {
                setSuccessMessage(`Successfully fetched and imported ${data.leads.length} high-intent leads!`);
                onLeadsImported(data.leads);
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setError('No matching leads found. Try broadening the search parameters.');
            }
        } catch (err: any) {
            console.error('Apify run error:', err);
            setError(err.message || 'Failed to connect to Apify.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-zinc-100 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-900 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-zinc-950 font-bold">
                            <GlowIcon name="zap" size={22} className="fill-current"  />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold">Source Leads via Apify</h2>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
                                    Live Extraction
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400">
                                Automated B2B intelligence for companies hiring data annotators.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <GlowIcon name="xmark" size={20}  />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleRunSourcing} className="p-6 space-y-5">
                    {approvalUrl && (
                        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 text-xs rounded-2xl space-y-2">
                            <p className="font-bold flex items-center gap-1.5">
                                <GlowIcon name="alert-circle" size={15} className="text-amber-600 shrink-0"  />
                                One-Time Actor Permission Approval Required
                            </p>
                            <p className="text-[11px] text-amber-800">
                                Apify requires you to click &quot;Approve&quot; once in your console to grant this actor permission on your account:
                            </p>
                            <a
                                href={approvalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                            >
                                Approve on Apify Console ↗
                            </a>
                        </div>
                    )}

                    {error && !approvalUrl && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                            <GlowIcon name="alert-circle" size={16} className="shrink-0"  />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                            <GlowIcon name="checkmark-circle" size={16} className="shrink-0 text-emerald-600"  />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Apify API Key */}
                    <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <GlowIcon name="key" size={13} className="text-amber-500"  /> Apify API Token *
                            </span>
                            <a
                                href="https://console.apify.com/account#/integrations"
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 font-semibold hover:underline"
                            >
                                Get API Token ↗
                            </a>
                        </label>
                        <input
                            type="password"
                            required
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="apify_api_..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-mono"
                        />
                        <p className="text-[11px] text-zinc-400 mt-1">
                            Your key is stored securely in your browser session for recurring runs.
                        </p>
                    </div>

                    {/* Target Domain / Persona */}
                    <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-2">
                            Target Buyer Vertical (Data Annotation & RLHF)
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {[
                                { id: 'rlhf', title: 'Generative AI & LLMs', desc: 'RLHF, Model Evaluation, Red-Teaming' },
                                { id: 'healthcare', title: 'Healthcare & MedTech', desc: 'Clinical NLP & Imaging Annotation' },
                                { id: 'legal', title: 'LegalTech & FinTech', desc: 'Contract Clause Markup & Extraction' },
                                { id: 'robotics', title: 'Robotics & Physical AI', desc: '3D Spatial Vision & Bounding Boxes' }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        category === cat.id
                                            ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 text-amber-950'
                                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                                    }`}
                                >
                                    <span className="font-bold block text-xs">{cat.title}</span>
                                    <span className="text-[10px] text-zinc-500 line-clamp-1">{cat.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Count */}
                    <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                            Number of Verified Leads to Siphon
                        </label>
                        <select
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white font-medium"
                        >
                            <option value={25}>25 Verified Leads (Fastest ~30s)</option>
                            <option value={50}>50 Verified Leads (~60s)</option>
                            <option value={100}>100 Verified Leads (Max per run)</option>
                        </select>
                    </div>

                    {/* Live Processing Notice */}
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-[11px] text-zinc-500 flex items-center gap-2">
                        <GlowIcon name="server" size={15} className="text-zinc-400 shrink-0"  />
                        <span>Actor fetches executive verified LinkedIn URLs, work emails, and firmographics directly into the CRM pipeline.</span>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <GlowIcon name="refresh-cw" size={14} className="animate-spin text-amber-400"  />
                                    Extracting from Apify...
                                </>
                            ) : (
                                <>
                                    <GlowIcon name="star" size={14} className="text-amber-400"  />
                                    Start Live Sourcing
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
