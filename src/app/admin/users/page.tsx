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
import GlowIcon from '@/components/ui/GlowIcon';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function TalentPoolPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();

            if (data && data.users) {
                setUsers(data.users);
            }
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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <LoadingSpinner size={36} />
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Loading Talent Pool...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Talent Pool</h1>
                    <p className="text-zinc-500 font-medium font-medium">Manage and vet professionals on the platform.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <GlowIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18}  />
                        <input
                            type="text"
                            placeholder="Search names or emails..."
                            className="bg-white border border-zinc-200 rounded-2xl pl-12 pr-6 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm w-full md:w-80 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all text-zinc-600 shadow-sm">
                        <GlowIcon name="filter" size={18}  />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Professional</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">Score</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-6 py-10 text-center">
                                            <div className="w-full h-10 bg-zinc-50 animate-pulse rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-zinc-400 font-medium">
                                        No professionals found matching your search.
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-xs uppercase">
                                                {user.fullName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                                                    {user.fullName}
                                                    {user.role === 'superadmin' && <span className="bg-zinc-900 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-xs">Super</span>}
                                                </div>
                                                <div className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <GlowIcon name="mail" size={12} />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-zinc-900">
                                                {user.latestRole}
                                            </span>
                                            {user.applicationCount > 1 && (
                                                <span className="text-[10px] text-zinc-400 font-medium">
                                                    + {user.applicationCount - 1} other applications
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {user.assessmentScore !== undefined ? (
                                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-bold text-xs bg-zinc-100 text-zinc-900 border border-zinc-200">
                                                {Math.round(user.assessmentScore)}%
                                            </span>
                                        ) : (
                                            <span className="text-zinc-300 text-xs font-bold uppercase tracking-widest">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-xs bg-zinc-900" />
                                            <span className="text-xs font-bold text-zinc-900">{user.status || 'Applied'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-zinc-500 font-medium text-xs">
                                            <GlowIcon name="calendar" size={12} />
                                            {user.createdAt?.seconds
                                                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                                                : user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                    : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => updateUserStatus(user.id, 'Vetted')}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                title="Approve / Vet"
                                            >
                                                <GlowIcon name="checkmark-circle" size={20}  />
                                            </button>
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all"
                                                title="View Profile"
                                            >
                                                <GlowIcon name="external-link" size={20}  />
                                            </Link>
                                            <button className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all">
                                                <GlowIcon name="dots" size={20}  />
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
