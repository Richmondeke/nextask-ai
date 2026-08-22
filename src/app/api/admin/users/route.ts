import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ADMIN_EMAILS, isAdminEmail } from '@/lib/constants';

export async function GET() {
    try {
        const liveProfiles: any[] = [];
        const seenEmails = new Set<string>();

        // 1. Fetch from Firestore profiles collection
        try {
            const profilesSnap = await getDocs(collection(db, 'profiles'));
            profilesSnap.forEach((docSnap) => {
                const data = docSnap.data();
                const email = (data.email || '').toLowerCase().trim();
                if (email) seenEmails.add(email);
                const isSuperAdmin = isAdminEmail(email) || data.role === 'admin' || data.role === 'superadmin';

                liveProfiles.push({
                    id: docSnap.id,
                    uid: docSnap.id,
                    fullName: data.fullName || data.name || (email ? email.split('@')[0] : 'Registered User'),
                    email: data.email || 'No email provided',
                    role: isSuperAdmin ? 'admin' : (data.role || 'user'),
                    status: data.status || (isSuperAdmin ? 'Active Admin' : 'Registered'),
                    headline: data.headline || data.specialty || (isSuperAdmin ? 'Superadmin Operator' : 'Specialist Candidate'),
                    country: data.country || 'Nigeria 🇳🇬',
                    createdAt: data.createdAt || '2026-08-19T00:00:00.000Z',
                    updatedAt: data.updatedAt || null,
                    referralCode: data.referralCode || 'NT-ADMIN',
                });
            });
        } catch (e: any) {
            console.warn('Firestore fetch notice:', e.message);
        }

        // 2. Ensure all 5 authorized Superadmin accounts are present in the list
        ADMIN_EMAILS.forEach((email) => {
            const normalized = email.toLowerCase().trim();
            if (!seenEmails.has(normalized)) {
                let name = 'Platform Admin';
                if (normalized.includes('richmond')) name = 'Richmond Eke';
                else if (normalized.includes('eric')) name = 'Eric Aimola';
                else if (normalized.includes('pedro')) name = 'Pedro Aimola';
                else if (normalized.includes('western')) name = 'Western';

                liveProfiles.push({
                    id: `admin-${normalized.split('@')[0]}`,
                    uid: `usr_${normalized.split('@')[0]}_auth`,
                    fullName: name,
                    email: email,
                    role: 'admin',
                    status: 'Active Admin',
                    headline: 'Superadmin & Platform Operator',
                    country: 'Nigeria 🇳🇬',
                    createdAt: '2026-04-19T06:34:29.000Z',
                    updatedAt: new Date().toISOString(),
                    referralCode: `NT-ADM-${normalized.slice(0, 4).toUpperCase()}`,
                });
                seenEmails.add(normalized);
            }
        });

        // Sort: Admins first, then newest
        liveProfiles.sort((a, b) => {
            if (a.role === 'admin' && b.role !== 'admin') return -1;
            if (a.role !== 'admin' && b.role === 'admin') return 1;
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
        });

        return NextResponse.json({
            success: true,
            totalUsers: liveProfiles.length,
            users: liveProfiles
        });
    } catch (error: any) {
        console.error('API /admin/users error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
