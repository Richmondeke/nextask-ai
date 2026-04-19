import React, { useState } from 'react';
import {
    Tag,
    MessageSquare,
    ShieldCheck,
    Search,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Smile,
    Frown,
    Meh,
    AlertTriangle
} from 'lucide-react';
import { Entity } from '@/lib/assessmentData';

interface TaskProps {
    type: 'categorization' | 'sentiment' | 'ner' | 'fact-check';
    content: any;
    options?: string[];
    onComplete: (data: any) => void;
}

export default function TaskStyles({ type, content, options, onComplete }: TaskProps) {
    const [selection, setSelection] = useState<string | null>(null);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [activeLabel, setActiveLabel] = useState<string | null>(null);

    const handleTextSelection = () => {
        if (type !== 'ner' || !activeLabel) return;

        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        const selectedText = sel.toString().trim();
        if (!selectedText) return;

        // Check if entity already exists
        if (!entities.some(e => e.text === selectedText)) {
            setEntities([...entities, { text: selectedText, label: activeLabel }]);
        }

        sel.removeAllRanges();
    };

    const removeEntity = (text: string) => {
        setEntities(entities.filter(e => e.text !== text));
    };

    const renderCategorization = () => (
        <div className="space-y-6">
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-sm font-medium text-zinc-900 leading-relaxed">
                    {typeof content === 'string' ? content : content.text}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    &quot;{typeof content === 'string' ? content : content.text}&quot;
                </div>
                <div className="flex flex-wrap justify-between gap-4">
                    {sentimentOptions.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => setSelection(opt.label)}
                            className={`flex-1 min-w-[120px] flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${selection === opt.label
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
            <div
                className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 leading-loose text-zinc-900 font-medium select-text"
                onMouseUp={handleTextSelection}
            >
                {typeof content === 'string' ? content : content.text}
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">1. Select a Label Type</p>
                <div className="flex flex-wrap gap-2">
                    {['PERSON', 'ORG', 'LOC', 'DATE', 'MISC'].map(label => (
                        <button
                            key={label}
                            onClick={() => setActiveLabel(label)}
                            className={`px-4 py-2 rounded-lg border text-[10px] font-black tracking-widest transition-all uppercase ${activeLabel === label
                                ? 'bg-zinc-900 text-white border-zinc-900'
                                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">2. Identified Entities ({entities.length})</p>
                {entities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {entities.map((e, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 group">
                                <span className="text-[10px] font-bold">{e.text}</span>
                                <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase">{e.label}</span>
                                <button onClick={() => removeEntity(e.text)} className="ml-1 hover:text-red-500">
                                    <XCircle size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-zinc-400 italic">Select text and click a label above to add entities.</p>
                )}
            </div>
        </div>
    );

    const renderFactChecking = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                    <div className="space-y-1">
                        <p className="text-xs font-black text-orange-900 uppercase">Submitted Claim</p>
                        <p className="text-sm font-medium text-orange-800">{content.claim}</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm max-h-60 overflow-y-auto">
                    <p className="text-xs font-black text-zinc-400 uppercase mb-4 tracking-widest">Source Document</p>
                    <p className="text-sm leading-relaxed text-zinc-600">{content.source}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-4">
                {['SUPPORTED', 'CONTRADICTED', 'NOT_ENOUGH_INFO'].map(verdict => (
                    <button
                        key={verdict}
                        onClick={() => setSelection(verdict)}
                        className={`flex-1 py-4 px-2 rounded-xl border-2 text-[10px] font-black tracking-widest uppercase transition-all ${selection === verdict
                            ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100'
                            : 'border-zinc-100 text-zinc-400 hover:border-zinc-200 bg-white'
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
            case 'fact-check': return <ShieldCheck className="text-blue-600" />;
        }
    };

    const isComplete = type === 'ner' ? entities.length > 0 : !!selection;
    const handleSubmit = () => {
        if (type === 'ner') {
            onComplete(entities);
        } else {
            onComplete(selection);
        }
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    {getIcon()}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-zinc-900 capitalize">{type.replace('-', ' ')} Task</h4>
                    <p className="text-xs font-medium text-zinc-500">Expert Annotation Assessment</p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-100 shadow-sm">
                {type === 'categorization' && renderCategorization()}
                {type === 'sentiment' && renderSentiment()}
                {type === 'ner' && renderNER()}
                {type === 'fact-check' && renderFactChecking()}
            </div>

            <button
                disabled={!isComplete}
                onClick={handleSubmit}
                className={`w-full py-4 rounded-2xl text-[13px] font-black transition-all shadow-xl ${isComplete
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
                    }`}
            >
                Submit Assessment
            </button>
        </div>
    );
}
