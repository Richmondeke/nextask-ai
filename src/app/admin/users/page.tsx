'use client';

import React, { useEffect, useState } from 'react';
import {
    getDocs,
    collection,
    query,
    orderBy,
    doc,
    updateDoc,
    limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Clock,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from 'lucide-react';

export default function TalentPoolPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'), limit(50));
            const querySnapshot = await getDocs(q);
            const userData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId: string, status: string) => {
        try {
            await updateDoc(doc(db, 'profiles', userId), {
                status: status,
                updatedAt: new Date().toISOString()
            });
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Talent Pool</h1>
                    <p className="text-zinc-500 font-medium font-medium">Manage and vet professionals on the platform.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search names or emails..."
                            className="bg-white border border-zinc-200 rounded-2xl pl-12 pr-6 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm w-full md:w-80 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all text-zinc-600 shadow-sm">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Professional</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Role</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Joined</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-8 py-12 text-center">
                                            <div className="w-full h-12 bg-zinc-50 animate-pulse rounded-2xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-zinc-400 font-medium">
                                        No professionals found matching your search.
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                                                {user.fullName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 flex items-center gap-2">
                                                    {user.fullName}
                                                    {user.role === 'superadmin' && <span className="bg-purple-100 text-purple-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">Super</span>}
                                                </div>
                                                <div className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium text-zinc-600">
                                            {user.headline || 'Professional'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'Vetted' ? 'bg-emerald-500' :
                                                user.status === 'Interviewing' ? 'bg-blue-500' :
                                                    'bg-amber-500'
                                                }`} />
                                            <span className="text-sm font-bold text-zinc-900">{user.status || 'Applied'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => updateUserStatus(user.id, 'Vetted')}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                title="Approve / Vet"
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all"
                                                title="View Profile"
                                            >
                                                <ExternalLink size={20} />
                                            </Link>
                                            <button className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
