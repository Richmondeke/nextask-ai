'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, MessageSquare, Smartphone } from 'lucide-react';

interface PhoneVerificationModalProps {
    onClose: () => void;
}

export default function PhoneVerificationModal({ onClose }: PhoneVerificationModalProps) {
    const [step, setStep] = useState<'input' | 'verify'>('input');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [method, setMethod] = useState<'whatsapp' | 'sms'>('whatsapp');
    const [country, setCountry] = useState({ code: '+234', name: 'Nigeria', flag: '🇳🇬' });

    const countries = [
        { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
        { code: '+1', name: 'USA', flag: '🇺🇸' },
        { code: '+44', name: 'UK', flag: '🇬🇧' },
        { code: '+91', name: 'India', flag: '🇮🇳' },
        { code: '+254', name: 'Kenya', flag: '🇰🇪' },
        { code: '+233', name: 'Ghana', flag: '🇬🇭' },
        { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Smartphone size={24} />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
                            <X size={20} className="text-zinc-400" />
                        </button>
                    </div>

                    {step === 'input' ? (
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-zinc-900">Verify your phone</h2>
                                <p className="text-zinc-500 text-sm">
                                    We need to verify your phone number to ensure the security of your account and matching.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Phone Number</label>
                                    <div className="flex gap-3">
                                        <div className="relative group">
                                            <select
                                                value={country.code}
                                                onChange={(e) => {
                                                    const c = countries.find(c => c.code === e.target.value);
                                                    if (c) setCountry(c);
                                                }}
                                                className="h-14 pl-4 pr-10 rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
                                            >
                                                {countries.map(c => (
                                                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="812 345 6789"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="flex-1 h-14 px-6 rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Receive code through</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setMethod('whatsapp')}
                                            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${method === 'whatsapp'
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-xl scale-90 ${method === 'whatsapp' ? 'bg-blue-100' : 'bg-zinc-50 text-zinc-400'}`}>
                                                <MessageSquare size={18} />
                                            </div>
                                            <span className="font-bold text-sm">WhatsApp</span>
                                        </button>
                                        <button
                                            onClick={() => setMethod('sms')}
                                            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${method === 'sms'
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-xl scale-90 ${method === 'sms' ? 'bg-blue-100' : 'bg-zinc-50 text-zinc-400'}`}>
                                                <ShieldCheck size={18} />
                                            </div>
                                            <span className="font-bold text-sm">SMS</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('verify')}
                                disabled={!phoneNumber}
                                className="w-full h-14 rounded-2xl bg-blue-700 text-white font-bold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                            >
                                Send Code
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-zinc-900">Verify Code</h2>
                                <p className="text-zinc-500 text-sm">
                                    We've sent a 6-digit verification code to <span className="text-zinc-900 font-bold">{country.code} {phoneNumber}</span> via {method === 'whatsapp' ? 'WhatsApp' : 'SMS'}.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-center gap-3">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength={1}
                                            className="w-12 h-14 text-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-bold text-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                    ))}
                                </div>

                                <button className="w-full text-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                    Didn't receive a code? Resend
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep('input')}
                                    className="flex-1 h-14 rounded-2xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-50 transition-all"
                                >
                                    Change Number
                                </button>
                                <button
                                    className="flex-2 h-14 px-12 rounded-2xl bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function ChevronDown({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
