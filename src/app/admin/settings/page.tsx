'use client';

import React, { useEffect, useState } from 'react';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    Save,
    Shield,
    Globe,
    Bell,
    CreditCard,
    Zap,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        platformName: 'Nexttask.ai',
        maintenanceMode: false,
        allowNewSignups: true,
        platformFee: 10,
        featuredJobsLimit: 5,
        supportEmail: 'support@nextask.ai'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
            if (settingsDoc.exists()) {
                setSettings(settingsDoc.data() as any);
            } else {
                // Initialize default settings if not exists
                await setDoc(doc(db, 'settings', 'platform'), settings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateDoc(doc(db, 'settings', 'platform'), settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-zinc-500 font-medium">Loading platform configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Admin Settings</h1>
                    <p className="text-zinc-500 font-medium">Global platform configuration and security controls.</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${saved
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-zinc-900 text-white shadow-zinc-900/20 hover:bg-zinc-800'
                        }`}
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    {saving ? 'Saving...' : saved ? 'Settings Saved' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 text-zinc-900 mb-2">
                        <Globe size={20} className="text-blue-600" />
                        <h2 className="text-lg font-bold">General</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Platform Name</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                value={settings.platformName}
                                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Support Email</label>
                            <input
                                type="email"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* System Controls */}
                <div className="bg-zinc-900 p-8 rounded-[40px] text-white space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={20} className="text-blue-400" />
                        <h2 className="text-lg font-bold text-white">System Controls</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div>
                                <p className="font-bold text-sm">Maintenance Mode</p>
                                <p className="text-[10px] text-zinc-400">Lock the platform for all non-admin users.</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-zinc-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div>
                                <p className="font-bold text-sm">Allow Signups</p>
                                <p className="text-[10px] text-zinc-400">Enable or disable new user registration.</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, allowNewSignups: !settings.allowNewSignups })}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.allowNewSignups ? 'bg-blue-500' : 'bg-zinc-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.allowNewSignups ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Market Settings */}
                <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 text-zinc-900 mb-2">
                        <CreditCard size={20} className="text-emerald-600" />
                        <h2 className="text-lg font-bold">Marketplace</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Platform Fee (%)</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-bold"
                                value={settings.platformFee}
                                onChange={(e) => setSettings({ ...settings, platformFee: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Featured Limit</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-bold"
                                value={settings.featuredJobsLimit}
                                onChange={(e) => setSettings({ ...settings, featuredJobsLimit: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 text-zinc-900 mb-2">
                        <Bell size={20} className="text-purple-600" />
                        <h2 className="text-lg font-bold">Notifications</h2>
                    </div>

                    <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-3 text-purple-700 mb-2">
                            <Zap size={16} />
                            <p className="text-sm font-bold">Real-time alerts active</p>
                        </div>
                        <p className="text-xs text-purple-600/80 leading-relaxed font-medium">
                            Admins will receive instant push notifications for new talent signups and job applications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
