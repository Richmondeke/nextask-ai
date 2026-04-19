'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    dark?: boolean;
}

export default function Logo({ className = '', iconOnly = false, dark = false }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-3 ${className}`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg ${dark ? 'shadow-blue-900/40' : 'shadow-blue-500/20'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H8L16 16V20H12L4 8V4Z" fill="white" />
                    <path d="M16 4H20V12L8 20H4V16L16 4Z" fill="white" fillOpacity="0.5" />
                </svg>
            </div>
            {!iconOnly && (
                <span className={`text-2xl font-bold tracking-tighter ${dark ? 'text-white' : 'text-zinc-900'}`}>
                    Nexttask
                </span>
            )}
        </Link>
    );
}
