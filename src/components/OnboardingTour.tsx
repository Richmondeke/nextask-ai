'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, CheckCircle2, Star } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface Step {
    id: string;
    title: string;
    description: string;
    targetId?: string;
    position?: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

const steps: Step[] = [
    {
        id: 'welcome',
        title: 'Welcome to Nextask AI! 🚀',
        description: 'Nexttask AI connects you with the world\'s most exciting opportunities. Let\'s quickly set you up for success.',
        position: 'center'
    },
    {
        id: 'profile',
        title: 'Complete Your Profile',
        description: 'A complete profile increases your visibility to recruiters by 3x. Add your experience and link your LinkedIn to stand out.',
        targetId: 'sidebar-link-profile',
        position: 'right'
    },
    {
        id: 'phone',
        title: 'Verify Your Identity',
        description: 'Protect your account and start applying for roles by verifying your phone number. This is a one-time step.',
        targetId: 'task-card-phone',
        position: 'bottom'
    },
    {
        id: 'refer',
        title: 'Refer & Earn',
        description: 'Invite your friends to Nextask AI and earn bonuses for every successfully matched referral. Share the success!',
        targetId: 'sidebar-link-referrals',
        position: 'right'
    }
];

export default function OnboardingTour({ userId, onComplete }: { userId: string, onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    const updateTargetRect = useCallback(() => {
        const step = steps[currentStep];
        if (step.targetId) {
            const element = document.getElementById(step.targetId);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep]);

    useEffect(() => {
        updateTargetRect();
        window.addEventListener('resize', updateTargetRect);
        window.addEventListener('scroll', updateTargetRect);
        return () => {
            window.removeEventListener('resize', updateTargetRect);
            window.removeEventListener('scroll', updateTargetRect);
        };
    }, [updateTargetRect]);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await finishTour();
        }
    };

    const finishTour = async () => {
        setIsVisible(false);
        try {
            await updateDoc(doc(db, 'profiles', userId), {
                onboardingCompleted: true
            });
            onComplete();
        } catch (error) {
            console.error('Failed to save onboarding status:', error);
        }
    };

    if (!isVisible) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop with Hole */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 pointer-events-auto"
                style={{
                    clipPath: targetRect
                        ? `polygon(0% 0%, 0% 100%, ${targetRect.left}px 100%, ${targetRect.left}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.bottom}px, ${targetRect.left}px ${targetRect.bottom}px, ${targetRect.left}px 100%, 100% 100%, 100% 0%)`
                        : 'none'
                }}
            />

            {/* Modal */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40, transition: { duration: 0.2 } }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                        opacity: { duration: 0.4 }
                    }}
                    className={`pointer-events-auto fixed bg-white rounded-3xl p-8 shadow-2xl border border-zinc-100 max-w-sm w-full mx-4 ${step.position === 'center' ? 'relative' : ''
                        }`}
                    style={
                        targetRect && step.position !== 'center'
                            ? {
                                top: step.position === 'bottom' ? targetRect.bottom + 20 :
                                    step.position === 'top' ? targetRect.top - 380 :
                                        targetRect.top,
                                left: step.position === 'right' ? targetRect.right + 20 :
                                    step.position === 'left' ? targetRect.left - 400 :
                                        targetRect.left
                            }
                            : {}
                    }
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            {currentStep === 0 ? <Star className="text-blue-600" fill="currentColor" /> : <CheckCircle2 className="text-blue-600" />}
                        </div>
                        <button
                            onClick={finishTour}
                            className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3 mb-8">
                        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-zinc-500 leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-zinc-100'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-3">
                            {currentStep === 0 && (
                                <button
                                    onClick={finishTour}
                                    className="text-zinc-400 text-sm font-bold px-4 py-2 hover:text-zinc-600"
                                >
                                    Skip
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                            >
                                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
