'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

export default function FadeIn({ children, delay = 0, direction = 'up', className = '' }: FadeInProps) {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...(directions[direction] || { y: 20 })
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0
            }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.21, 0.45, 0.32, 0.9],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
