export const ADMIN_EMAILS: string[] = [
    'richmondeke@gmail.com',
    'ekerichmond@gmail.com',
    'westernupz@gmail.com',
    'aimolaeric6@gmail.com',
    'pedroaimola36@gmail.com'
];

export function isAdminEmail(email?: string | null): boolean {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalized);
}
