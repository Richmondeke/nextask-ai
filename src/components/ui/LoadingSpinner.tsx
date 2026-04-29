'use client';

import React from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
}

export default function LoadingSpinner({ size = 48, className = '' }: LoadingSpinnerProps) {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <Image
                src="/loading.gif"
                alt="Loading..."
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
