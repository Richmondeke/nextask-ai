'use client';

import React from 'react';
import { Settings, Shield, Bell, Globe, Save } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Admin Settings</h1>
                <p className="text-zinc-500">Configure platform-wide parameters and security controls.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
                        <div className="p-6 space-y-4">
                            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                                <Shield size={18} className="text-blue-600" />
                                Security Controls
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-semibold">Maintenance Mode</p>
                                        <p className="text-xs text-zinc-500">Restrict access to superadmins only</p>
                                    </div>
                                    <div className="w-10 h-5 bg-zinc-200 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <button className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2 rounded-xl font-semibold hover:bg-zinc-800 transition-all ml-auto">
                                <Save size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                        <h3 className="font-bold text-lg mb-2">System Health</h3>
                        <p className="text-blue-100 text-sm mb-4">All systems are operational with 99.9% uptime over the last 30 days.</p>
                        <div className="h-1 w-full bg-blue-400 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
