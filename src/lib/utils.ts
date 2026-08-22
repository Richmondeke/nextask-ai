import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NT-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export function generateId(length = 20) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function formatAuthError(err: any): string {
    if (!err) return 'An unexpected error occurred. Please try again.';
    const code = err.code || '';
    const message = err.message || '';

    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        return 'Invalid email or password. Please check your credentials or sign up.';
    }
    if (code === 'auth/email-already-in-use') {
        return 'An account with this email already exists. Please log in instead.';
    }
    if (code === 'auth/weak-password') {
        return 'Password is too weak. Please use at least 6 characters.';
    }
    if (code === 'auth/invalid-email') {
        return 'Please enter a valid email address.';
    }
    if (code === 'auth/network-request-failed') {
        return 'Network connection issue. Please check your internet connection.';
    }
    if (code === 'auth/popup-closed-by-user') {
        return 'Sign-in popup was closed before completing.';
    }
    if (message.includes('Database is closing') || message.includes('hidden') || message.includes('internal-error')) {
        return 'Connection refreshed. Please click Sign In again.';
    }
    return message.replace(/^Firebase:\s*Error\s*\(auth\/[^)]+\)\.?\s*/i, '') || 'Sign-in failed. Please try again.';
}

export * from './constants';
