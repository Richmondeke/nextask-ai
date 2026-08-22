'use client';

import React, { useState, useEffect, useMemo } from 'react';
import GlowIcon from '@/components/ui/GlowIcon';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CompanyLead,
    LeadStage,
    LeadPriority,
    STAGES,
    INDUSTRIES,
    subscribeToLeads,
    createLead,
    updateLead,
    deleteLead,
    addLeadNote,
    seedSampleLeadsIntoDb,
    exportLeadsToCsv,
    SAMPLE_SEED_LEADS
} from '@/lib/leads-service';
import LeadModal from '@/components/admin/LeadModal';
import LinkedInTemplateDrawer from '@/components/admin/LinkedInTemplateDrawer';
import ApifySourcingModal from '@/components/admin/ApifySourcingModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ADMIN_EMAILS } from '@/lib/constants';

export default function AdminLeadsCRMPage() {
    const [mounted, setMounted] = useState(false);
    const [leads, setLeads] = useState<CompanyLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStage, setSelectedStage] = useState<string>('all');
    const [selectedVa, setSelectedVa] = useState<string>('all');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');
    const [followUpFilter, setFollowUpFilter] = useState<'all' | 'due_today' | 'overdue'>('all');

    // Modals and Drawers
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [isApifyModalOpen, setIsApifyModalOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState<CompanyLead | null>(null);
    const [activeLinkedInLead, setActiveLinkedInLead] = useState<CompanyLead | null>(null);
    const [selectedLeadDetails, setSelectedLeadDetails] = useState<CompanyLead | null>(null);

    // Note logging inside details drawer
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteType, setNewNoteType] = useState<'note' | 'linkedin_message' | 'call'>('note');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [isSendingReport, setIsSendingReport] = useState(false);
    const [reportStatus, setReportStatus] = useState('');

    const handleSendAdminEmailReport = async () => {
        try {
            setIsSendingReport(true);
            setReportStatus('');
            const res = await fetch('/api/admin/send-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emails: ADMIN_EMAILS
                })
            });
            const data = await res.json();
            if (data.success) {
                setReportStatus('Report emailed to admins!');
                setTimeout(() => setReportStatus(''), 4000);
            }
        } catch (e: any) {
            console.error('Email report error:', e);
        } finally {
            setIsSendingReport(false);
        }
    };

    // Mount & Real-time listener
    useEffect(() => {
        setMounted(true);
        setLoading(true);
        const unsubscribe = subscribeToLeads((fetchedLeads) => {
            setLeads(fetchedLeads);
            setLoading(false);
            if (selectedLeadDetails) {
                const refreshed = fetchedLeads.find(l => l.id === selectedLeadDetails.id);
                if (refreshed) setSelectedLeadDetails(refreshed);
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, []);

    // Unique VAs for filtering
    const vaList = useMemo(() => {
        const set = new Set<string>();
        leads.forEach(l => { if (l.assignedVa) set.add(l.assignedVa); });
        return Array.from(set);
    }, [leads]);

    // Filtered Leads
    const filteredLeads = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];

        return leads.filter((lead) => {
            // Search text
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchCompany = lead.companyName?.toLowerCase().includes(q);
                const matchContact = lead.contactName?.toLowerCase().includes(q);
                const matchIndustry = lead.industry?.toLowerCase().includes(q);
                const matchNeeds = lead.dataSourcingNeeds?.some(n => n.toLowerCase().includes(q));
                if (!matchCompany && !matchContact && !matchIndustry && !matchNeeds) return false;
            }

            // Stage filter
            if (selectedStage !== 'all' && lead.stage !== selectedStage) return false;

            // VA filter
            if (selectedVa !== 'all' && lead.assignedVa !== selectedVa) return false;

            // Priority filter
            if (selectedPriority !== 'all' && lead.priority !== selectedPriority) return false;

            // Follow-up status filter
            if (followUpFilter === 'due_today') {
                if (lead.nextFollowUpDate !== todayStr) return false;
            } else if (followUpFilter === 'overdue') {
                if (!lead.nextFollowUpDate || lead.nextFollowUpDate >= todayStr) return false;
            }

            return true;
        });
    }, [leads, searchQuery, selectedStage, selectedVa, selectedPriority, followUpFilter]);

    // Metric Calculations
    const metrics = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const total = leads.length;
        const activeOutreach = leads.filter(l => ['linkedin_sent', 'in_conversation', 'sample_sent', 'call_scheduled'].includes(l.stage)).length;
        const dueTodayOrOverdue = leads.filter(l => l.nextFollowUpDate && l.nextFollowUpDate <= todayStr && l.stage !== 'closed_won' && l.stage !== 'lost').length;
        const closedWon = leads.filter(l => l.stage === 'closed_won').length;
        const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

        return { total, activeOutreach, dueTodayOrOverdue, closedWon, totalPipelineValue };
    }, [leads]);

    // Handlers
    const handleSaveLead = async (leadData: any) => {
        if (leadToEdit && leadToEdit.id) {
            await updateLead(leadToEdit.id, leadData);
        } else {
            await createLead(leadData);
        }
    };

    const handleStageChange = async (leadId: string, newStage: LeadStage) => {
        await updateLead(leadId, { stage: newStage });
    };

    const handleDelete = async (leadId: string) => {
        if (confirm('Are you sure you want to remove this lead?')) {
            await deleteLead(leadId);
            if (selectedLeadDetails?.id === leadId) setSelectedLeadDetails(null);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteText.trim() || !selectedLeadDetails?.id) return;

        try {
            setIsSavingNote(true);
            await addLeadNote(selectedLeadDetails.id, selectedLeadDetails.notes, {
                text: newNoteText.trim(),
                authorName: selectedLeadDetails.assignedVa || 'VA Admin',
                type: newNoteType
            });
            setNewNoteText('');
        } catch (err) {
            console.error('Failed to add note:', err);
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleSeedDemoData = async () => {
        if (confirm('Seed 5 realistic data sourcing leads into the CRM?')) {
            setLoading(true);
            await seedSampleLeadsIntoDb();
            setLoading(false);
        }
    };

    const handleExportCsv = () => {
        const csv = exportLeadsToCsv(filteredLeads);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `onionlabel_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFollowUpBadge = (dateStr?: string) => {
        if (!dateStr) return null;
        const todayStr = new Date().toISOString().split('T')[0];
        if (dateStr < todayStr) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-900 text-white border border-zinc-900">
                    <GlowIcon name="alert-circle" size={10} /> Overdue ({dateStr})
                </span>
            );
        }
        if (dateStr === todayStr) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-900 border border-zinc-300">
                    <GlowIcon name="clock" size={10} /> Due Today
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                <GlowIcon name="calendar" size={10} /> {dateStr}
            </span>
        );
    };

    const getPriorityBadge = (p: LeadPriority) => {
        switch (p) {
            case 'urgent':
                return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-900 text-white uppercase tracking-wider">Urgent</span>;
            case 'high':
                return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-900 border border-zinc-300 uppercase tracking-wider">High</span>;
            case 'medium':
                return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">Medium</span>;
            case 'low':
            default:
                return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-50 text-zinc-400 border border-zinc-200/50">Low</span>;
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <LoadingSpinner size={36} />
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Loading Pipeline...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Top Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-white">
                            Sourcing Pipeline
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">B2B Data Client Acquisition</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                        Data Sourcing Leads & LinkedIn CRM
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium mt-0.5">
                        Track target companies hiring for scraping, LLM fine-tuning datasets, and AI data labeling.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {leads.length === 0 && (
                        <button
                            onClick={handleSeedDemoData}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold rounded-xl border border-zinc-200 transition-colors"
                        >
                            <GlowIcon name="star" size={14} /> Seed Sample Leads
                        </button>
                    )}
                    <button
                        onClick={handleExportCsv}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold rounded-xl border border-zinc-300 transition-all shadow-xs"
                    >
                        <GlowIcon name="download-cloud" size={14} /> Export CSV
                    </button>
                    <button
                        onClick={() => { setLeadToEdit(null); setIsLeadModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                        <GlowIcon name="plus" size={16} /> Track New Company
                    </button>
                </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Total Pipeline</span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-black text-zinc-900">{metrics.total}</h3>
                        <span className="text-xs font-semibold text-zinc-500">Accounts</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Active Outreach</span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-black text-zinc-900">{metrics.activeOutreach}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200">Active</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Follow-ups Due</span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-black text-zinc-900">
                            {metrics.dueTodayOrOverdue}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200">Pending</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Closed Won</span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-black text-zinc-900">{metrics.closedWon}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200">Won</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs col-span-2 md:col-span-1">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Pipeline Volume</span>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-black text-zinc-900">${metrics.totalPipelineValue.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            {/* Controls Bar: Search, Filters, Views */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search bar */}
                    <div className="relative flex-1">
                        <GlowIcon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"  />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search company, contact, industry, or data requirements..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'kanban'
                                    ? 'bg-white text-zinc-900 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                        >
                            <GlowIcon name="grid" size={14}  /> Kanban
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'table'
                                    ? 'bg-white text-zinc-900 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                        >
                            <GlowIcon name="columns" size={14}  /> Table
                        </button>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 text-xs">
                    <span className="text-zinc-400 font-bold flex items-center gap-1">
                        <GlowIcon name="filter" size={12}  /> Filters:
                    </span>

                    {/* Stage Filter */}
                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium outline-none text-xs"
                    >
                        <option value="all">All Stages</option>
                        {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>

                    {/* VA Filter */}
                    <select
                        value={selectedVa}
                        onChange={(e) => setSelectedVa(e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium outline-none text-xs"
                    >
                        <option value="all">All Owners</option>
                        {vaList.map(va => <option key={va} value={va}>{va}</option>)}
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium outline-none text-xs"
                    >
                        <option value="all">All Priorities</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    {/* Follow up status toggle pills */}
                    <button
                        onClick={() => setFollowUpFilter(followUpFilter === 'due_today' ? 'all' : 'due_today')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                            followUpFilter === 'due_today'
                                ? 'bg-zinc-900 text-white'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                    >
                        Due Today
                    </button>
                    <button
                        onClick={() => setFollowUpFilter(followUpFilter === 'overdue' ? 'all' : 'overdue')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                            followUpFilter === 'overdue'
                                ? 'bg-zinc-900 text-white'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                    >
                        Overdue
                    </button>

                    {(searchQuery || selectedStage !== 'all' || selectedVa !== 'all' || selectedPriority !== 'all' || followUpFilter !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedStage('all');
                                setSelectedVa('all');
                                setSelectedPriority('all');
                                setFollowUpFilter('all');
                            }}
                            className="text-blue-600 font-bold hover:underline ml-auto"
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area: Kanban or Table */}
            {(!mounted || loading) ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
                    <LoadingSpinner size={36} />
                    <p className="text-xs text-zinc-400 font-medium">Syncing pipeline leads from Firestore...</p>
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80 shadow-sm space-y-4">
                    <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
                        <GlowIcon name="layers" size={28}  />
                    </div>
                    <div className="max-w-md mx-auto">
                        <h3 className="text-base font-bold text-zinc-900">No matching leads found</h3>
                        <p className="text-xs text-zinc-500 mt-1">
                            {searchQuery || selectedStage !== 'all'
                                ? 'Try adjusting your filters or search keywords.'
                                : 'Start prospecting target companies that need data sourcing services, or load sample leads.'}
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                            onClick={handleSeedDemoData}
                            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 hover:bg-purple-100 transition-colors"
                        >
                            Load Sample Demo Leads
                        </button>
                        <button
                            onClick={() => { setLeadToEdit(null); setIsLeadModalOpen(true); }}
                            className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors"
                        >
                            + Track First Lead
                        </button>
                    </div>
                </div>
            ) : viewMode === 'kanban' ? (
                /* KANBAN BOARD */
                <div className="overflow-x-auto pb-6">
                    <div className="flex gap-4 min-w-[1400px]">
                        {STAGES.map((stage) => {
                            const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
                            const stageVal = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

                            return (
                                <div key={stage.id} className="w-80 shrink-0 bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 flex flex-col max-h-[78vh]">
                                    {/* Column Header */}
                                    <div className="p-2 mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-xs bg-zinc-900" />
                                            <h4 className="text-xs font-bold text-zinc-900">{stage.label}</h4>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-zinc-700 border border-zinc-200">
                                                {stageLeads.length}
                                            </span>
                                        </div>
                                        {stageVal > 0 && (
                                            <span className="text-[10px] font-semibold text-zinc-500">
                                                ${stageVal.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Cards Scroll Container */}
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                        {stageLeads.map((lead) => (
                                            <div
                                                key={lead.id}
                                                onClick={() => setSelectedLeadDetails(lead)}
                                                className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-400 transition-all cursor-pointer group"
                                            >
                                                {/* Card Top: Priority & Value */}
                                                <div className="flex items-center justify-between mb-2">
                                                    {getPriorityBadge(lead.priority)}
                                                    <span className="text-xs font-bold text-zinc-900">
                                                        ${(lead.estimatedValue || 0).toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Funding Badge */}
                                                {lead.fundingRound && (
                                                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                                        <span className="text-[9px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-md">
                                                            {lead.fundingRound}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Company & Industry */}
                                                <h5 className="font-bold text-sm text-zinc-900 group-hover:underline transition-colors">
                                                    {lead.companyName}
                                                </h5>
                                                <p className="text-[11px] text-zinc-400 mb-2">{lead.industry}</p>

                                                {/* Expert Workforce Required Snippet */}
                                                {lead.expertWorkforceNeeded && (
                                                    <div className="mb-2.5 p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-[10px] text-zinc-700 font-medium">
                                                        <span className="text-zinc-400 font-bold uppercase tracking-wider block mb-0.5 text-[9px]">Target Profile:</span>
                                                        <span className="line-clamp-2 leading-relaxed text-zinc-800">{lead.expertWorkforceNeeded}</span>
                                                    </div>
                                                )}

                                                {/* Annual Data Budget */}
                                                {lead.annualDataBudget && (
                                                    <div className="text-[10px] text-zinc-500 font-semibold mb-2.5 flex items-center justify-between">
                                                        <span>Est. Data Budget:</span>
                                                        <span className="text-zinc-900 font-bold">{lead.annualDataBudget}</span>
                                                    </div>
                                                )}

                                                {/* Data Needs Tags */}
                                                {lead.dataSourcingNeeds && lead.dataSourcingNeeds.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {lead.dataSourcingNeeds.slice(0, 2).map((need) => (
                                                            <span key={need} className="text-[9px] font-medium px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-zinc-700">
                                                                {need}
                                                            </span>
                                                        ))}
                                                        {lead.dataSourcingNeeds.length > 2 && (
                                                            <span className="text-[9px] font-medium px-1 py-0.5 text-zinc-400">
                                                                +{lead.dataSourcingNeeds.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Decision Maker Contact Snippet */}
                                                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                                                    <div className="min-w-0 pr-2">
                                                        <p className="text-xs font-semibold text-zinc-800 truncate">
                                                            {lead.contactName || 'No DM Added'}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 truncate">
                                                            {lead.contactRole || 'Role not specified'}
                                                        </p>
                                                    </div>

                                                    {/* Quick Action LinkedIn Assistant Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveLinkedInLead(lead);
                                                        }}
                                                        title="Launch LinkedIn Outreach Assistant"
                                                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shrink-0 shadow-2xs"
                                                    >
                                                        <GlowIcon name="message-square" size={13}  />
                                                    </button>
                                                </div>

                                                {/* Follow-up Due Alert Ribbon */}
                                                {lead.nextFollowUpDate && (
                                                    <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px]">
                                                        {getFollowUpBadge(lead.nextFollowUpDate)}
                                                        <span className="text-zinc-400 font-medium truncate max-w-[80px]">
                                                            {lead.assignedVa || 'Unassigned'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {stageLeads.length === 0 && (
                                            <div className="h-24 border border-dashed border-zinc-200 rounded-2xl flex items-center justify-center text-xs text-zinc-400">
                                                No leads in stage
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* TABLE VIEW */
                <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    <th className="py-3.5 px-4">Company</th>
                                    <th className="py-3.5 px-4">Decision Maker</th>
                                    <th className="py-3.5 px-4">Requirements</th>
                                    <th className="py-3.5 px-4">Stage</th>
                                    <th className="py-3.5 px-4">Est. Value</th>
                                    <th className="py-3.5 px-4">Follow-up</th>
                                    <th className="py-3.5 px-4">Owner</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-xs">
                                {filteredLeads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        onClick={() => setSelectedLeadDetails(lead)}
                                        className="hover:bg-zinc-50/80 transition-colors cursor-pointer"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                                                {lead.companyName}
                                                {lead.website && (
                                                    <a
                                                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-zinc-400 hover:text-blue-600"
                                                    >
                                                        <GlowIcon name="external-link" size={12}  />
                                                    </a>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-zinc-400 font-medium">{lead.industry}</span>
                                        </td>

                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-zinc-800 flex items-center gap-1.5">
                                                {lead.contactName || '—'}
                                                {lead.linkedinUrl && (
                                                    <a
                                                        href={lead.linkedinUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-[#0077b5] hover:opacity-80"
                                                    >
                                                        <GlowIcon name="external-link" size={12}  />
                                                    </a>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-zinc-400">{lead.contactRole}</span>
                                        </td>

                                        <td className="py-4 px-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {lead.dataSourcingNeeds?.slice(0, 2).map((n) => (
                                                    <span key={n} className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] rounded-md font-medium">
                                                        {n}
                                                    </span>
                                                ))}
                                                {(lead.dataSourcingNeeds?.length || 0) > 2 && (
                                                    <span className="text-[10px] text-zinc-400">+{lead.dataSourcingNeeds!.length - 2}</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <select
                                                value={lead.stage}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => lead.id && handleStageChange(lead.id, e.target.value as LeadStage)}
                                                className="text-xs font-semibold px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg outline-none cursor-pointer"
                                            >
                                                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                            </select>
                                        </td>

                                        <td className="py-4 px-4 font-bold text-emerald-600">
                                            ${(lead.estimatedValue || 0).toLocaleString()}
                                        </td>

                                        <td className="py-4 px-4">
                                            {getFollowUpBadge(lead.nextFollowUpDate) || <span className="text-zinc-300">—</span>}
                                        </td>

                                        <td className="py-4 px-4 font-medium text-zinc-600">
                                            {lead.assignedVa || 'Unassigned'}
                                        </td>

                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setActiveLinkedInLead(lead)}
                                                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                                                    title="LinkedIn Template Helper"
                                                >
                                                    <GlowIcon name="message-square" size={14}  />
                                                </button>
                                                <button
                                                    onClick={() => { setLeadToEdit(lead); setIsLeadModalOpen(true); }}
                                                    className="p-1.5 hover:bg-zinc-100 text-zinc-500 rounded-lg transition-colors"
                                                    title="Edit Lead"
                                                >
                                                    <GlowIcon name="edit" size={14}  />
                                                </button>
                                                <button
                                                    onClick={() => lead.id && handleDelete(lead.id)}
                                                    className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                                                    title="Delete Lead"
                                                >
                                                    <GlowIcon name="trash" size={14}  />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Lead Details & Activity Log Side Drawer */}
            <AnimatePresence>
                {selectedLeadDetails && (
                    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200"
                        >
                            {/* Drawer Top */}
                            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-900 text-white">
                                <div className="min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-white truncate">
                                            {selectedLeadDetails.companyName}
                                        </h3>
                                        {getPriorityBadge(selectedLeadDetails.priority)}
                                    </div>
                                    <p className="text-xs text-zinc-400 font-medium">
                                        {selectedLeadDetails.industry} • Assigned to <span className="text-white font-semibold">{selectedLeadDetails.assignedVa || 'Unassigned'}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setLeadToEdit(selectedLeadDetails); setIsLeadModalOpen(true); }}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title="Edit Lead"
                                    >
                                        <GlowIcon name="edit" size={18}  />
                                    </button>
                                    <button
                                        onClick={() => setSelectedLeadDetails(null)}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <GlowIcon name="xmark" size={20}  />
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Body Scroll */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Action Banner: LinkedIn Outreach Assistant */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-md">
                                    <div>
                                        <h4 className="text-sm font-bold flex items-center gap-1.5">
                                            <GlowIcon name="star" size={16} className="text-amber-300"  /> LinkedIn Outreach Assistant
                                        </h4>
                                        <p className="text-xs text-blue-100 mt-0.5">
                                            Generate 1-click personalized pitches & follow-up messages.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveLinkedInLead(selectedLeadDetails)}
                                        className="px-3.5 py-2 bg-white text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm shrink-0"
                                    >
                                        Launch Assistant
                                    </button>
                                </div>

                                {/* Company & Contact Overview Card */}
                                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 space-y-3 text-xs">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <span className="text-zinc-400 block font-medium">Target Decision Maker</span>
                                            <span className="font-bold text-zinc-900 text-sm">
                                                {selectedLeadDetails.contactName || 'Not identified'}
                                            </span>
                                            <p className="text-zinc-500">{selectedLeadDetails.contactRole}</p>
                                        </div>
                                        <div>
                                            <span className="text-zinc-400 block font-medium">Est. Contract Value</span>
                                            <span className="font-bold text-zinc-900 text-sm">
                                                ${(selectedLeadDetails.estimatedValue || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-zinc-200 flex flex-wrap gap-4 text-xs">
                                        {selectedLeadDetails.linkedinUrl && (
                                            <a
                                                href={selectedLeadDetails.linkedinUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-zinc-900 font-bold flex items-center gap-1 hover:underline"
                                            >
                                                LinkedIn Profile <GlowIcon name="external-link" size={12} />
                                            </a>
                                        )}
                                        {selectedLeadDetails.website && (
                                            <a
                                                href={selectedLeadDetails.website.startsWith('http') ? selectedLeadDetails.website : `https://${selectedLeadDetails.website}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-zinc-900 font-bold flex items-center gap-1 hover:underline"
                                            >
                                                Website <GlowIcon name="external-link" size={12} />
                                            </a>
                                        )}
                                        {selectedLeadDetails.contactEmail && (
                                            <span className="text-zinc-600 font-medium">
                                                Email: {selectedLeadDetails.contactEmail}
                                            </span>
                                        )}
                                    </div>

                                    {/* Data Needs Tags */}
                                    <div className="pt-2 border-t border-zinc-200">
                                        <span className="text-zinc-400 block font-medium mb-1.5">Data Sourcing Needs</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedLeadDetails.dataSourcingNeeds?.map(n => (
                                                <span key={n} className="px-2 py-1 bg-white border border-zinc-200 rounded-md text-zinc-800 font-medium text-[11px]">
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Brief & Data Strategy */}
                                <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-xs bg-zinc-900" />
                                            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">
                                                Account Brief & Data Strategy
                                            </h4>
                                        </div>
                                        {selectedLeadDetails.fundingRound && (
                                            <span className="text-[10px] font-bold text-zinc-800 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">
                                                {selectedLeadDetails.fundingRound}
                                            </span>
                                        )}
                                    </div>

                                    {/* Strategy Meta Badges */}
                                    <div className="flex flex-wrap gap-2 text-[11px]">
                                        {selectedLeadDetails.annualDataBudget && (
                                            <div className="px-2.5 py-1 bg-white border border-zinc-200 rounded-md text-zinc-800 font-medium flex items-center gap-1.5">
                                                <GlowIcon name="percent" size={12} className="text-zinc-600" />
                                                <span>Budget: <strong className="text-zinc-900">{selectedLeadDetails.annualDataBudget}</strong></span>
                                            </div>
                                        )}
                                        {selectedLeadDetails.competitorVendors && selectedLeadDetails.competitorVendors.length > 0 && (
                                            <div className="px-2.5 py-1 bg-white border border-zinc-200 rounded-md text-zinc-800 font-medium flex items-center gap-1.5">
                                                <GlowIcon name="layers" size={12} className="text-zinc-600" />
                                                <span>Incumbents: <strong className="text-zinc-900">{selectedLeadDetails.competitorVendors.join(', ')}</strong></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Operational Outsource Driver */}
                                    {selectedLeadDetails.whyTheyBuy && (
                                        <div className="border-l-2 border-zinc-900 pl-3 py-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                                                Operational Bottleneck
                                            </span>
                                            <p className="text-xs text-zinc-800 leading-relaxed font-normal">
                                                {selectedLeadDetails.whyTheyBuy}
                                            </p>
                                        </div>
                                    )}

                                    {/* Required Workforce Profile */}
                                    {selectedLeadDetails.expertWorkforceNeeded && (
                                        <div className="p-3 bg-white rounded-lg border border-zinc-200 text-xs">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                                Target Specialist Profile
                                            </span>
                                            <p className="text-xs text-zinc-900 font-medium leading-relaxed">
                                                {selectedLeadDetails.expertWorkforceNeeded}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Tailored Outreach Hook */}
                                {selectedLeadDetails.recommendedOutreachHook && (
                                    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-xs bg-zinc-900" />
                                                <h4 className="text-xs font-bold text-zinc-900">
                                                    Targeted Outreach Pitch
                                                </h4>
                                            </div>
                                            <span className="text-[10px] text-zinc-400 font-medium">
                                                Personalized for {selectedLeadDetails.contactName?.split(' ')[0] || 'Lead'}
                                            </span>
                                        </div>
                                        <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-800 leading-relaxed font-normal whitespace-pre-wrap select-text">
                                            {selectedLeadDetails.recommendedOutreachHook}
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-[10px] text-zinc-400">
                                                {selectedLeadDetails.recommendedOutreachHook.length} characters
                                            </span>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await navigator.clipboard.writeText(selectedLeadDetails.recommendedOutreachHook || '');
                                                    if (selectedLeadDetails.id) {
                                                        await addLeadNote(selectedLeadDetails.id, selectedLeadDetails.notes, {
                                                            text: `[Sent Outreach Pitch]\n${selectedLeadDetails.recommendedOutreachHook}`,
                                                            authorName: selectedLeadDetails.assignedVa || 'Alex (VA)',
                                                            type: 'linkedin_message'
                                                        });
                                                    }
                                                    if (selectedLeadDetails.linkedinUrl) {
                                                        window.open(selectedLeadDetails.linkedinUrl, '_blank');
                                                    }
                                                }}
                                                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                                            >
                                                <GlowIcon name="copy" size={13} />
                                                <span>Copy & Launch LinkedIn ↗</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Stage Progress Selector */}
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                                        Current Pipeline Stage
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {STAGES.map((s) => {
                                            const isCurr = selectedLeadDetails.stage === s.id;
                                            return (
                                                <button
                                                    key={s.id}
                                                    onClick={() => selectedLeadDetails.id && handleStageChange(selectedLeadDetails.id, s.id)}
                                                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                                                        isCurr
                                                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                                                            : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                                                    }`}
                                                >
                                                    {s.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Activity & Note Logging */}
                                <div className="space-y-4 pt-4 border-t border-zinc-200">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                                        <span>Log</span>
                                        <span className="text-zinc-400 font-normal">
                                            {selectedLeadDetails.notes?.length || 0} notes
                                        </span>
                                    </h4>

                                    {/* Note Input Box */}
                                    <form onSubmit={handleAddNote} className="space-y-2 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                                        <textarea
                                            value={newNoteText}
                                            onChange={(e) => setNewNoteText(e.target.value)}
                                            placeholder="Log a call, message reply, or update..."
                                            rows={3}
                                            className="w-full p-2.5 text-xs bg-white border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 resize-none text-zinc-800"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => setNewNoteType('note')}
                                                    className={`px-2 py-1 rounded-md font-bold text-[10px] transition-colors ${newNoteType === 'note' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'}`}
                                                >
                                                    Note
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewNoteType('linkedin_message')}
                                                    className={`px-2 py-1 rounded-md font-bold text-[10px] transition-colors ${newNoteType === 'linkedin_message' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'}`}
                                                >
                                                    Message
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewNoteType('call')}
                                                    className={`px-2 py-1 rounded-md font-bold text-[10px] transition-colors ${newNoteType === 'call' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'}`}
                                                >
                                                    Call / Demo
                                                </button>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSavingNote || !newNoteText.trim()}
                                                className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-40"
                                            >
                                                {isSavingNote ? 'Saving...' : 'Add to Log'}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Notes Timeline List */}
                                    <div className="space-y-3">
                                        {selectedLeadDetails.notes && selectedLeadDetails.notes.length > 0 ? (
                                            selectedLeadDetails.notes.map((note) => (
                                                <div key={note.id} className="p-3.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs space-y-1">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="font-bold text-zinc-800">{note.authorName}</span>
                                                        <span className="text-zinc-400">
                                                            {new Date(note.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                                        {note.text}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-zinc-400 text-center py-4">No notes logged yet. Log the first outreach note above.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
                                <button
                                    onClick={() => selectedLeadDetails.id && handleDelete(selectedLeadDetails.id)}
                                    className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                                >
                                    <GlowIcon name="trash" size={14}  /> Delete Lead
                                </button>
                                <button
                                    onClick={() => setSelectedLeadDetails(null)}
                                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add / Edit Lead Modal */}
            <LeadModal
                isOpen={isLeadModalOpen}
                onClose={() => { setIsLeadModalOpen(false); setLeadToEdit(null); }}
                onSave={handleSaveLead}
                leadToEdit={leadToEdit}
            />

            {/* LinkedIn Outreach Template Helper Drawer */}
            <LinkedInTemplateDrawer
                isOpen={!!activeLinkedInLead}
                onClose={() => setActiveLinkedInLead(null)}
                lead={activeLinkedInLead}
                vaName={activeLinkedInLead?.assignedVa || 'Alex'}
                onLogOutreach={async (templateTitle, text) => {
                    if (activeLinkedInLead?.id) {
                        await addLeadNote(activeLinkedInLead.id, activeLinkedInLead.notes, {
                            text: `[LinkedIn Outreach Logged: ${templateTitle}]\n${text}`,
                            authorName: activeLinkedInLead.assignedVa || 'VA Admin',
                            type: 'linkedin_message'
                        });
                        // Automatically update stage to 'linkedin_sent' if currently 'sourced' or 'decision_maker_found'
                        if (activeLinkedInLead.stage === 'sourced' || activeLinkedInLead.stage === 'decision_maker_found') {
                            await updateLead(activeLinkedInLead.id, { stage: 'linkedin_sent' });
                        }
                    }
                }}
            />
            {/* Apify Automated Sourcing Modal */}
            <ApifySourcingModal
                isOpen={isApifyModalOpen}
                onClose={() => setIsApifyModalOpen(false)}
                onLeadsImported={async (newLeads) => {
                    for (const l of newLeads) {
                        await createLead(l);
                    }
                }}
            />
        </div>
    );
}
