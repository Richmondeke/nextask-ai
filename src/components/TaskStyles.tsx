'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag,
    MessageSquare,
    ShieldCheck,
    Search,
    Type,
    AlertCircle,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Smile,
    Frown,
    Meh,
    AlertTriangle
} from 'lucide-react';

interface TaskProps {
    type: 'categorization' | 'sentiment' | 'ner' | 'fact_checking';
    content: any;
    options?: string[];
    onComplete: (data: any) => void;
}

export default function TaskStyles({ type, content, options, onComplete }: TaskProps) {
    const [selection, setSelection] = useState<any>(null);
    const [highlights, setHighlights] = useState<{ start: number, end: number, label: string }[]>([]);

    const renderCategorization = () => (
        <div className="space-y-6">
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-sm font-medium text-zinc-900 leading-relaxed">{content.text}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {options?.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setSelection(opt)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selection === opt
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-zinc-100 bg-white hover:border-zinc-200 text-zinc-600'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider">{opt}</span>
                            {selection === opt && <CheckCircle2 size={16} />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderSentiment = () => {
        const sentimentOptions = [
            { label: 'Positive', icon: Smile, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Neutral', icon: Meh, color: 'text-zinc-600', bg: 'bg-zinc-50' },
            { label: 'Negative', icon: Frown, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Mixed', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' }
        ];

        return (
            <div className="space-y-8">
                <div className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm italic text-zinc-600">
                    "{content.text}"
                </div>
                <div className="flex justify-between gap-4">
                    {sentimentOptions.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => setSelection(opt.label)}
                            className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${selection === opt.label
                                    ? `border-blue-600 ${opt.bg} shadow-md`
                                    : 'border-zinc-50 bg-white hover:border-zinc-100'
                                }`}
                        >
                            <opt.icon size={32} className={selection === opt.label ? opt.color : 'text-zinc-300'} />
                            <span className={`text-[11px] font-black uppercase tracking-widest ${selection === opt.label ? opt.color : 'text-zinc-400'
                                }`}>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderNER = () => (
        <div className="space-y-6">
            <div className="p-1 leading-loose text-zinc-900 font-medium">
                {content.text}
                <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-600 font-bold flex items-center gap-2">
                    <Type size={14} />
                    Highlight the entities in the text above and label them.
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {['PERSON', 'ORG', 'LOC', 'DATE', 'MISC'].map(label => (
                    <button key={label} className="px-4 py-2 rounded-lg border border-zinc-200 text-[10px] font-black tracking-widest hover:bg-zinc-50 transition-colors uppercase">
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderFactChecking = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                    <div className="space-y-1">
                        <p className="text-xs font-black text-orange-900 uppercase">Submited Claim</p>
                        <p className="text-sm font-medium text-orange-800">{content.claim}</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm max-h-60 overflow-y-auto">
                    <p className="text-xs font-black text-zinc-400 uppercase mb-4 tracking-widest">Source Document</p>
                    <p className="text-sm leading-relaxed text-zinc-600">{content.source}</p>
                </div>
            </div>
            <div className="flex gap-4">
                {['SUPPORTED', 'CONTRADICTED', 'NOT_ENOUGH_INFO'].map(verdict => (
                    <button
                        key={verdict}
                        onClick={() => setSelection(verdict)}
                        className={`flex-1 py-4 rounded-xl border-2 text-[11px] font-black tracking-widest uppercase transition-all ${selection === verdict
                                ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
                            }`}
                    >
                        {verdict.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>
        </div>
    );

    const getIcon = () => {
        switch (type) {
            case 'categorization': return <Tag className="text-blue-600" />;
            case 'sentiment': return <MessageSquare className="text-blue-600" />;
            case 'ner': return <Search className="text-blue-600" />;
            case 'fact_checking': return <ShieldCheck className="text-blue-600" />;
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    {getIcon()}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-zinc-900 capitalize">{type.replace('_', ' ')} Task</h4>
                    <p className="text-xs font-medium text-zinc-500">Expert Annotation Assessment</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                {type === 'categorization' && renderCategorization()}
                {type === 'sentiment' && renderSentiment()}
                {type === 'ner' && renderNER()}
                {type === 'fact_checking' && renderFactChecking()}
            </div>

            <button
                disabled={!selection}
                onClick={() => onComplete(selection)}
                className={`w-full py-4 rounded-2xl text-[13px] font-black transition-all shadow-xl ${selection
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
                    }`}
            >
                Submit Assessment
            </button>
        </div>
    );
}
